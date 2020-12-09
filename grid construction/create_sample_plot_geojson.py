import json
import pandas
import geopandas
from geopandas import GeoDataFrame, GeoSeries
import matplotlib.pyplot as plt
from matplotlib.colors import Normalize
import matplotlib.cm as cm
import seaborn as sns
from shapely.geometry import Point, Polygon
import numpy as np
import googlemaps
from datetime import datetime
plt.rcParams["figure.figsize"] = [8,6]
import pickle
import requests

# Get the shape-file for NYC
boros = GeoDataFrame.from_file('./Borough Boundaries/geo_export_e66b8353-e3f3-49c0-9a5e-4622cdc09c91.shp')
boros = boros.set_index('boro_code')
boros = boros.sort_index()

# Plot and color by borough
boros.plot(column = 'boro_name')
plt.show()

# Get rid of are that you aren't interested in (too far away)
# plt.gca().set_xlim([-74.05, -73.85])
# plt.gca().set_ylim([40.65, 40.9])

plt.gca().set_xlim([-74.05, -73.7])
plt.gca().set_ylim([40.57, 40.91])


# make a grid of latitude-longitude values
xmin_bk, xmax_bk, ymin_bk, ymax_bk = -73.953167, -73.905960, 40.679515, 40.709711
xmin_nyc, xmax_nyc, ymin_nyc, ymax_nyc = -74.05, -73.7, 40.57, 40.91
xx, yy = np.meshgrid(np.linspace(xmin_bk,xmax_bk,19), np.linspace(ymin_bk,ymax_bk,19))
xc = xx.flatten()
yc = yy.flatten()
# Now convert these points to geo-data
pts_npy = [(x, y) for x, y in zip(xc, yc)]
pts = GeoSeries([Point(x[0], x[1]) for x in pts_npy])

all_nyc = [val for pos,val in enumerate(pts)]
pts = GeoSeries(all_nyc)

# Plot to make sure it makes sense:
pts.plot(markersize=1)
plt.show()
# Now get the lat-long coordinates in a dataframe
coords = []
for n, point in enumerate(pts):
    coords += [','.join(__ for __ in _.strip().split(' ')[::-1]) for _ in str(point).split('(')[1].split(')')[0].split(',')]
print("hey")

destination = "40.754499,-73.985378"

payload = {}
headers = {}

commutes = []


polygons = []
centroids_X = []
centroids_Y = []
centroids = []
for i in range(xx.shape[0] - 2):
    for j in range(xx.shape[1] - 2):
        poly = Polygon([(xx[i][j], yy[i][j]), (xx[i+1][j], yy[i+1][j]), (xx[i+1][j+1], yy[i+1][j+1]), (xx[i][j+1], yy[i][j+1])])
        polygons.append(poly)
        centroids.append(poly.centroid.coords)
        centroids_X.append(poly.centroid.x)
        centroids_Y.append(poly.centroid.y)

nyc_grid = GeoDataFrame({'centroids_x': centroids_X, 'centroids_y': centroids_Y, 'geometry': polygons})
nyc_grid.plot()
plt.show()
nyc_grid.to_file("nyc_geo.geojson", driver='GeoJSON')



print("ey")
