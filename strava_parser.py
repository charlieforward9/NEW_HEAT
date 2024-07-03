from datetime import datetime
import os
import shutil
from fit2gpx import StravaConverter
import gpxpy
import json
import h3

DIR_STRAVA = "/Users/crich/development/strava"
DIR_DATA = "/Users/crich/development/github/NEW_HEAT/data"
DIR_ACTIVITIES = DIR_DATA + "/activities"
HIGHEST_LENGTH = 29667

# Ref: https://gist.github.com/greenstick/b23e475d2bfdc3a82e34eaa1f6781ee4
def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 100, fill = '█', autosize = False):
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    styling = '%s |%s| %s%% %s' % (prefix, fill, percent, suffix)
    if autosize:
        cols, _ = shutil.get_terminal_size(fallback = (length, 1))
        length = cols - len(styling)
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print('\r%s' % styling.replace(fill, bar), end = '\r')
    # Print New Line on Complete
    if iteration == total: 
        print()

# Removes all non-spatial activities from the activities folder that do not provide value to creating a deckGL layer
def filter_non_relevant():
    for filename in os.listdir(DIR_ACTIVITIES):
        with open(os.path.join(DIR_ACTIVITIES, filename), 'r', encoding='utf-8', errors='ignore') as activity:
            gpx = gpxpy.parse(activity)
            if len(gpx.tracks) == 0:
                os.remove(os.path.join(DIR_ACTIVITIES, filename))
            else:
                for track in gpx.tracks:
                    if len(track.segments) == 0 or track.type == "Sail":
                        os.remove(os.path.join(DIR_ACTIVITIES, filename))
                        break
                    
# Add all the activities into a single file that can be used to create the relevant deckGL layers, this will be a JSON file
def gpx_to_layer(): 
    activity_layer = {}
    existing_indexes = set()  # Use a set for indexes
    i = 0
    printProgressBar(0, len(os.listdir(DIR_ACTIVITIES)), prefix = 'gpx_to_layer:', autosize = True)
    for filename in os.listdir(DIR_ACTIVITIES): 
        with open(os.path.join(DIR_ACTIVITIES, filename), 'r', encoding='utf-8', errors='ignore') as activity:
            gpx = gpxpy.parse(activity)
            if gpx.get_time_bounds().start_time is not None:
                gpx_layer = []
                for track in gpx.tracks:
                    for segment in track.segments:
                        for point in segment.points:
                            # If the lat lng is already in the activity_layer, skip it
                            index = h3.geo_to_h3(point.latitude, point.longitude, 14)
                            if index in existing_indexes:
                                continue
                            existing_indexes.add(index)
                            gpx_layer.append([point.time.timestamp(), point.longitude, point.latitude])
                activity_layer[int(gpx.get_time_bounds().start_time.timestamp())] = gpx_layer
        i += 1
        printProgressBar(i, len(os.listdir(DIR_ACTIVITIES)), prefix = 'gpx_to_layer:', autosize = True)
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
filter_non_relevant()
print("Non-relevant activities removed")
gpx_to_layer()
print("Successfully converted to layer JSON")
