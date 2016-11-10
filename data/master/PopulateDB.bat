ECHO OFF
ECHO Initializing task-tracker DB with master data...

ECHO:
ECHO "Importing master user..."
mongoimport --db task-tracker --collection users --file jsonFiles\user.json --type json --jsonArray

ECHO:
ECHO "Creating Task Collection..."
mongoimport --db task-tracker --collection tasks --file jsonFiles\task.json --type json --jsonArray
ECHO:
PAUSE