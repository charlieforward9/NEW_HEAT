from datetime import datetime
import os
import shutil
from fit2gpx import StravaConverter
from gpx_converter import Converter
import gpxpy
import json

DIR_STRAVA = "/Users/crich/Downloads/strava"
DIR_GPX = "/Users/crich/Downloads/strava/activities_gpx"
DIR_2022 = "/Users/crich/Downloads/strava/2022"
DIR_JSON = "/Users/crich/Documents/Github/animated_heatmap/data/2022json"


def gpx_to_2022gpx():
    index = 0
    for filename in os.listdir(DIR_GPX):
        with open(os.path.join(DIR_GPX, filename), 'r', encoding='utf-8', errors='ignore') as f:  # open in readonly mode
            if os.path.getsize(f.name) > 1000:
                gpx = gpxpy.parse(f)
                if gpx.get_time_bounds().start_time is not None and gpx.get_time_bounds().start_time.year == 2022:
                    print("Saving file to new dir")
                    shutil.move(os.path.join(f.name), os.path.join(DIR_2022))
                    index = index+1
                    print(index)


def gpx_to_json():
    file = []
    activity = {}
    index = 0
    output = os.path.abspath(os.path.join(
        os.getcwd(), "2022"+".json")).strip()
    for filename in os.listdir(DIR_2022):
        index += 1
        print(index)
        input = os.path.abspath(os.path.join(
            os.getcwd(), "2022/", filename)).strip()
        dic = Converter(input_file=input).gpx_to_dictionary()
        latitudes = dic['latitude']
        longitudes = dic['longitude']
        time = dic['time']

        path = []
        timestamps = []
        for i in range(len(latitudes)):
            path.append([latitudes[i], longitudes[i]])
            timestamps.append(time[i].timestamp())
        activity["path"] = path
        activity["timestamps"] = timestamps
        file.append(activity)
    with open(output, 'w') as f:
        json.dump(file, f)


# Step 1: Create StravaConverter object
# - Note: the dir_in must be the path to the central unzipped Strava bulk export folder
# - Note: You can specify the dir_out if you wish. By default it is set to 'activities_gpx', which will be created in main Strava folder specified.
# strava_conv = StravaConverter(
#     dir_in=DIR_STRAVA
# )
# print("Directory found")
# # Step 2: Unzip the zipped files
# strava_conv.unzip_activities()
# print("Activities unzipped")
# # Step 3: Add metadata to existing GPX files
# strava_conv.add_metadata_to_gpx()
# print("Metadata added")
# Step 4: Convert FIT to GPX
# strava_conv.strava_fit_to_gpx()
# print("Fit converted to GPX")
# gpx_to_2022gpx()
# print("This years files filtered")
gpx_to_json()
print("Successfully converted and merged to JSON")
