package com.deitel.welcome;

import android.app.usage.UsageEvents;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;

import static android.provider.AlarmClock.EXTRA_MESSAGE;
import static com.deitel.welcome.R.styleable.View;

public class MainActivity extends AppCompatActivity {

    private ImageView img;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        img = (ImageView) findViewById(R.id.mouseImageView);
        img.setOnClickListener(imgClickListener);
    }

    private final ImageView.OnClickListener imgClickListener =
            new ImageView.OnClickListener() {
                @Override
                public void onClick(View v) {
                    sendMessage();
                }
            };

    public void sendMessage() {
        Intent intent = new Intent(this, TipCalculatorActivity.class);
        startActivity(intent);
    }
}
