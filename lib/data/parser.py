import os
import shutil
from fit2gpx import StravaConverter
import gpxpy

DIR_STRAVA = "/Users/crich/Downloads/strava"
DIR_GPX = "/Users/crich/Downloads/strava/activities_gpx"
DIR_2022 = "/Users/crich/Downloads/strava/2022"


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


# Step 1: Create StravaConverter object
# - Note: the dir_in must be the path to the central unzipped Strava bulk export folder
# - Note: You can specify the dir_out if you wish. By default it is set to 'activities_gpx', which will be created in main Strava folder specified.
strava_conv = StravaConverter(
    dir_in=DIR_STRAVA
)

print("Directory found")
# # Step 2: Unzip the zipped files
strava_conv.unzip_activities()
print("Activities unzipped")
# # Step 3: Add metadata to existing GPX files
# strava_conv.add_metadata_to_gpx()
# print("Metadata added")
# Step 4: Convert FIT to GPX
strava_conv.strava_fit_to_gpx()
print("Fit converted to GPX")
gpx_to_2022gpx()
print("This years files filtered")
