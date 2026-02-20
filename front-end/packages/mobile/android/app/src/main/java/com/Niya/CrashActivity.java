package com.Niya;

import android.app.Activity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.ScrollView;
import android.widget.TextView;
import android.graphics.Color;
import android.view.Gravity;

public class CrashActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SharedPreferences prefs = getSharedPreferences("crash_log", MODE_PRIVATE);
        String crash = prefs.getString("last_crash", "No crash data available");
        prefs.edit().remove("last_crash").apply();

        ScrollView scroll = new ScrollView(this);
        scroll.setBackgroundColor(Color.parseColor("#1a1a2e"));
        scroll.setPadding(32, 64, 32, 32);

        TextView tv = new TextView(this);
        tv.setText("=== Niya Crash Report ===\n\n" + crash);
        tv.setTextColor(Color.parseColor("#e0e0e0"));
        tv.setTextSize(13);
        scroll.addView(tv);

        setContentView(scroll);
    }
}
