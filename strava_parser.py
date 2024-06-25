from datetime import datetime
import os
from fit2gpx import StravaConverter
import gpxpy
import json

DIR_STRAVA = "/Users/crich/development/strava"
DIR_DATA = "/Users/crich/development/github/NEW_HEAT/data"
DIR_ACTIVITIES = DIR_DATA + "/activities"
HIGHEST_LENGTH = 29667

# Removes all non-spatial activities from the activities folder that do not provide value to creating a deckGL layer
def filter_non_spacial():
    for filename in os.listdir(DIR_ACTIVITIES):
        with open(os.path.join(DIR_ACTIVITIES, filename), 'r', encoding='utf-8', errors='ignore') as activity:
            gpx = gpxpy.parse(activity)
            if len(gpx.tracks) == 0:
                os.remove(os.path.join(DIR_ACTIVITIES, filename))
            else:
                for track in gpx.tracks:
                    if len(track.segments) == 0:
                        os.remove(os.path.join(DIR_ACTIVITIES, filename))
                        break

# Add all the activities into a single file that can be used to create the relevant deckGL layers, this will be a JSON file
def gpx_to_layer(): 
    activity_layer = {}
    for filename in os.listdir(DIR_ACTIVITIES): 
        with open(os.path.join(DIR_ACTIVITIES, filename), 'r', encoding='utf-8', errors='ignore') as activity:
            gpx = gpxpy.parse(activity)
            if gpx.get_time_bounds().start_time is not None:
                gpx_layer = []
                for track in gpx.tracks:
                    for segment in track.segments:
                        for point in segment.points:
                            gpx_layer.append([point.time.timestamp(), point.longitude, point.latitude])
                activity_layer[gpx.get_time_bounds().start_time.timestamp()] = gpx_layer
    with open(os.path.join(DIR_DATA, "strava_layer.json"), 'w') as f:
        json.dump(activity_layer, f)

print("Starting Strava Archive Parser")
strava_conv = StravaConverter(dir_in=DIR_STRAVA, dir_out=DIR_ACTIVITIES)
print("Directory found")
strava_conv.unzip_activities()
print("Activities unzipped")
strava_conv.add_metadata_to_gpx()
print("Metadata added")
strava_conv.strava_fit_to_gpx()
print("Fit converted to GPX")
filter_non_spacial()
print("Non-spatial activities removed")
gpx_to_layer()
print("Successfully converted to layer JSON")
