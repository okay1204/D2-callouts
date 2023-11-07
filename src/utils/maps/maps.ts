import 'server-only'
import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react';
import { idToName } from '@/utils/strings';

export interface MapPosition {
    id: number;
    x: number;
    y: number;
    defaultName: string;
}

export interface Map {
    id: string;
    name: string;
    positions: MapPosition[];
}

export interface MapSet {
    id: string;
    name: string;
    maps: Map[];
}

export const getMapData = cache(async (): Promise<MapSet[]> => {
    // Get all the map sets
    const mapsDirectory = path.join(process.cwd(), '/src/utils/maps')
    const mapSetNames = await fs.readdir(mapsDirectory);

    const mapSets = await Promise.all(mapSetNames.map(async (mapSetName) => {
        const mapSetDirectory = path.join(mapsDirectory, mapSetName);
        const stat = await fs.stat(mapSetDirectory);

        if (!stat.isDirectory()) {
            return null;
        }

        const mapFiles = await fs.readdir(mapSetDirectory);
        const maps = await Promise.all(mapFiles.map(async (mapFile) => {
            // Skip if it's not a .ts file
            if (path.extname(mapFile) !== '.js') {
                return null;
            }

            const mapPath = path.join(mapSetDirectory, mapFile);
            const mapModule = await import(mapPath.replace('.ts', 'js'));
            const mapId = path.basename(mapFile, '.js');

            // Assuming the module exports a const named `map` that is a Map object
            return {
                id: mapId,
                name: idToName(mapId),
                positions: mapModule.positions
            } as Map;
        }));

        return {
            id: mapSetName,
            name: idToName(mapSetName),
            maps: maps.filter(Boolean) // remove any nulls from non-.ts files
        } as MapSet;
    }));

    return mapSets.filter(Boolean) as MapSet[]; // remove any nulls from non-directories
})