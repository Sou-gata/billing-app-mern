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
copy backend\run.bat dist\run.bat>nul
echo {"name": "maharaja_billing","main": "index.js","scripts": {"start": "node index.js"},"author": "Sougata Talukdar"} > dist\package.json
xcopy /isvy frontend\dist dist\public>nul
echo\
rmdir /s /q frontend\dist>nul
rmdir /s /q backend\dist>nul
cd dist
mkdir uploads

call 7z a -tzip full_app ./* 
cd ..
copy dist\full_app.zip full_app.zip>nul
rmdir /s /q dist>nul
echo Done.
