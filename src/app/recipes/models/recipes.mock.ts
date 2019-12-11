import { Recipe } from './recipes.model';

export const RECIPE_MOCKS: Recipe[] = [
    { id: 1, name: 'Erstes Rezept', lastPreparation: new Date() },
    { id: 2, name: 'Zweites Rezept', url: 'https://www.bettybossi.ch', note: 'Dies ist eine Notiz' }
];
