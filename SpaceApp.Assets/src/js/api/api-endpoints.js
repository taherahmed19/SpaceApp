export const applicationEndpoints = {
    IssTles: () => {
        return {
            method: 'GET',
            resource: `http://spaceappapi-local.co.uk/api/space/GetISSTles`,
            params: {},
            accept: "application/json",
            contentType: null,
            body: null,
        }
    },
    IssLocation: () => {
        return {
            method: 'GET',
            resource: `http://spaceappapi-local.co.uk/api/space/GetISS`,
            params: {},
            accept: "application/json",
            contentType: null,
            body: null,
        }
    },
    NearEarthObjects: () => {
        return {
            method: 'GET',
            resource: `http://spaceappapi-local.co.uk/api/space/GetNearEarthObjects`,
            params: {},
            accept: "application/json",
            contentType: null,
            body: null,
        }
    }
}