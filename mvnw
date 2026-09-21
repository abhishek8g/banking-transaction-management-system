#!/bin/sh
# ----------------------------------------------------------------------------
# Maven Start Up Shell script
# ----------------------------------------------------------------------------

DIR="$(cd "$(dirname "$0")" && pwd)"
WRAPPER_JAR="$DIR/.mvn/wrapper/maven-wrapper.jar"

if [ ! -f "$WRAPPER_JAR" ]; then
    echo "Downloading Maven Wrapper..."
    mkdir -p "$DIR/.mvn/wrapper"
    curl -sStL "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar" -o "$WRAPPER_JAR"
fi

exec java -jar "$WRAPPER_JAR" "$@"
