@echo off
rem Delegate to the android gradle wrapper
cd /d "%~dp0android"
call gradlew.bat %*
