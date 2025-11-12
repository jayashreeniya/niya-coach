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
import org.jetbrains.annotations.Nullable;

// import com.imagepicker.ImagePickerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
// import com.reactnative.ivpusic.imagepicker.*;

import com.agontuk.RNFusedLocation.RNFusedLocationPackage;

import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import com.horcrux.svg.SvgPackage;

import com.reactcommunity.rnlocalize.RNLocalizePackage;

import live.videosdk.rnfgservice.ForegroundServicePackage;
import live.videosdk.rnincallmanager.InCallManagerPackage;
import live.videosdk.rnwebrtc.WebRTCModulePackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import net.no_mad.tts.TextToSpeechPackage; 
// import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import com.reactnativecommunity.netinfo.NetInfoPackage;

import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

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
          // Packages that cannot be autolinked yet can be added manually here
          packages.add(new RNCWebViewPackage());
          packages.add(new RNFusedLocationPackage());
          packages.add(new ForegroundServicePackage());
          packages.add(new InCallManagerPackage());
          packages.add(new WebRTCModulePackage());
          packages.add(new ReactNativePushNotificationPackage());
          packages.add(new TextToSpeechPackage());
          packages.add(new SvgPackage());
          packages.add(new RNGestureHandlerPackage());
          packages.add(new RNDeviceInfo());
          packages.add(new NetInfoPackage());
          packages.add(new AsyncStoragePackage());
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
    Radar.initialize(this, "prj_live_pk_dc7bbaa26e61343e20a955965be95a7035dd611a");
    SoLoader.init(this, /* native exopackage */ false);
    FacebookSdk.sdkInitialize(getApplicationContext());
    // initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
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
