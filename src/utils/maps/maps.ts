import { cache } from 'react';
import 'server-only';
import ronMapset from './root-of-nightmares/mapset';

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
    const mapSets: MapSet[] = [ronMapset];

    return mapSets.filter(Boolean) as MapSet[]; // remove any nulls from non-directories
})