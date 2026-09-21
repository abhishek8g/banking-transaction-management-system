@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set MAVEN_DIR=%~dp0.mvn\wrapper
set WRAPPER_JAR=%MAVEN_DIR%\maven-wrapper.jar

set MAVEN_PROJECT_DIR=%~dp0
if "%MAVEN_PROJECT_DIR:~-1%"=="\" set MAVEN_PROJECT_DIR=%MAVEN_PROJECT_DIR:~0,-1%

if exist "%WRAPPER_JAR%" goto run

echo Downloading Maven Wrapper...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%WRAPPER_JAR%')"

:run
java "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECT_DIR%" -cp "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
