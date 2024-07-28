@echo off
if exist "backend\public" rmdir /s /q backend\public>nul
if exist dist rmdir /s /q dist>nul
echo\
echo Building frontend...
cd frontend
call npm run build>nul
cd ..
echo\
echo Building backend...
cd backend
call ncc build index.js -o dist>nul
cd ..
echo\
echo Copying builds...
mkdir "dist"
copy backend\dist\index.js dist\index.js>nul
copy backend\.env dist\.env>nul
mkdir dist\lib\binding\napi-v3
copy backend\node_modules\bcrypt\lib\binding\napi-v3\bcrypt_lib.node dist\lib\binding\napi-v3\bcrypt_lib.node>nul
copy backend\run.bat dist\run.bat>nul
echo {"name": "maharaja_billing","main": "index.js","license": "ISC", "scripts": {"start": "node index.js"},"author": "Sougata Talukdar"} > dist\package.json
xcopy /isvy frontend\dist dist\public>nul
echo\
rmdir /s /q frontend\dist>nul
rmdir /s /q backend\dist>nul
cd dist
mkdir uploads

@REM call 7z a -tzip full_app ./*
cd ..
@REM copy dist\full_app.zip full_app.zip>nul
@REM rmdir /s /q dist>nul
echo Done.
