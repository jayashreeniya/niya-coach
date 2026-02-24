package com.Niya;

import android.app.Activity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.graphics.Color;
import android.view.Gravity;
import android.content.ClipboardManager;
import android.content.ClipData;
import android.content.Context;
import android.widget.Toast;

public class CrashActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SharedPreferences prefs = getSharedPreferences("crash_log", MODE_PRIVATE);
        final String crash = prefs.getString("last_crash", "(empty - no crash data was captured)");

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(Color.parseColor("#1a1a2e"));
        layout.setPadding(32, 64, 32, 32);

        TextView title = new TextView(this);
        title.setText("NIYA CRASH REPORT");
        title.setTextColor(Color.parseColor("#ff6b6b"));
        title.setTextSize(18);
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 0, 0, 24);
        layout.addView(title);

        Button copyBtn = new Button(this);
        copyBtn.setText("Copy to Clipboard");
        copyBtn.setOnClickListener(v -> {
            ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            clipboard.setPrimaryClip(ClipData.newPlainText("crash_log", crash));
            Toast.makeText(this, "Copied!", Toast.LENGTH_SHORT).show();
        });
        layout.addView(copyBtn);

        ScrollView scroll = new ScrollView(this);
        scroll.setPadding(0, 16, 0, 0);

        TextView tv = new TextView(this);
        tv.setText(crash);
        tv.setTextColor(Color.parseColor("#e0e0e0"));
        tv.setTextSize(12);
        tv.setTextIsSelectable(true);
        scroll.addView(tv);

        layout.addView(scroll, new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.MATCH_PARENT, 1));

        setContentView(layout);
    }
}
