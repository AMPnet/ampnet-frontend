export class CountryModel {
    id: number;
    iso: string;
    name: string;
    nicename: string;
    iso3: string;
    numcode: number;
    phonecode: number;
}

export class CountriesModel {
    countries: CountryModel[];
}
