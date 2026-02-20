package com.Niya;

import androidx.multidex.MultiDexApplication;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import io.radar.react.RNRadarPackage;
import io.radar.sdk.Radar;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;
import android.content.SharedPreferences;
import org.jetbrains.annotations.Nullable;

// import com.imagepicker.ImagePickerPackage;
// import com.reactnative.ivpusic.imagepicker.*;

import com.agontuk.RNFusedLocation.RNFusedLocationPackage;

import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import live.videosdk.rnfgservice.ForegroundServicePackage;
import live.videosdk.rnincallmanager.InCallManagerPackage;
import live.videosdk.rnwebrtc.WebRTCModulePackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import net.no_mad.tts.TextToSpeechPackage; 
// import com.rnfs.RNFSPackage;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Only add packages that are NOT autolinked
          packages.add(new RNFusedLocationPackage());
          packages.add(new ForegroundServicePackage());
          packages.add(new InCallManagerPackage());
          packages.add(new WebRTCModulePackage());
          packages.add(new ReactNativePushNotificationPackage());
          packages.add(new TextToSpeechPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "packages/mobile/index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public Intent registerReceiver(@Nullable BroadcastReceiver receiver, IntentFilter filter) {
      if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
          return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
      } else {
          return super.registerReceiver(receiver, filter);
      }
  }

  @Override
  public void onCreate() {
    super.onCreate();

    Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
      @Override
      public void uncaughtException(Thread t, Throwable e) {
        String trace = Log.getStackTraceString(e);
        Log.e("NiyaCrash", "FATAL: " + e.getMessage() + "\n" + trace);
        try {
          SharedPreferences prefs = getSharedPreferences("crash_log", Context.MODE_PRIVATE);
          prefs.edit().putString("last_crash", e.getClass().getName() + ": " + e.getMessage() + "\n" + trace).apply();
          Intent crashIntent = new Intent(getApplicationContext(), CrashActivity.class);
          crashIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
          startActivity(crashIntent);
        } catch (Exception ignored) {}
        android.os.Process.killProcess(android.os.Process.myPid());
        System.exit(1);
      }
    });

    try {
      SoLoader.init(this, false);
    } catch (Exception e) {
      Log.e("NiyaCrash", "SoLoader.init failed: " + e.getMessage());
    }

    try {
      Radar.initialize(this, "prj_live_pk_dc7bbaa26e61343e20a955965be95a7035dd611a");
    } catch (Exception e) {
      Log.e("NiyaCrash", "Radar.initialize failed: " + e.getMessage());
    }

    try {
      FacebookSdk.sdkInitialize(getApplicationContext());
    } catch (Exception e) {
      Log.e("NiyaCrash", "FacebookSdk.init failed: " + e.getMessage());
    }
  }

  /**
   * Loads Flipper in React Native templates.
   * Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        
        Class<?> aClass = Class.forName("com.Niya.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
