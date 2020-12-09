
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


##
# Thank you to StackOverflow user Istbl from whom we adapted this algorithm.
# https://stackoverflow.com/questions/55199436/generate-grid-of-latitude-longitude-coordinates-that-fall-within-polygon
#
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
xmin, xmax, ymin, ymax = -74.05, -73.85, 40.65, 40.9
xmin_nyc, xmax_nyc, ymin_nyc, ymax_nyc = -74.05, -73.7, 40.57, 40.91
xc = np.load("nyc_x_flat.npy")
yc = np.load("nyc_y_flat.npy")
# Now convert these points to geo-data
pts_pickle = np.load("filtered_all_nyc_map.npy")
pts = GeoSeries([Point(x[0], x[1]) for x in pts_pickle])
in_map = np.load("in_map.npy")
all_nyc = [val for pos,val in enumerate(pts) if in_map[pos]]
pts = GeoSeries(all_nyc)

# Plot to make sure it makes sense:
pts.plot(markersize=1)
plt.show()
# Now get the lat-long coordinates in a dataframe
coords = []
for n, point in enumerate(pts):
    coords += [','.join(__ for __ in _.strip().split(' ')[::-1]) for _ in str(point).split('(')[1].split(')')[0].split(',')]
print("hey")

