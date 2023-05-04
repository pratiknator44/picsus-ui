do
> npx cap add android

in android/app/src/main/AndroidMenifest.xml, add permissions:
<uses-permission android:name="android.permission.INTERNET" /> // present by default

<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />