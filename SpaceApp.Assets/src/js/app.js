import renderEarthViewer from './earth';
import api from './api/fetch-api';

api.makeApiCall("IssTles", renderEarthViewer);
api.makeApiCall("NearEarthObjects", callback);