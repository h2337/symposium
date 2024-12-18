package io.github.jafarlihi.symposium.util;

import org.json.JSONException;
import org.json.JSONObject;

public class JSONUtil {

    public static String getStringFromJSONObject(JSONObject jsonObject, String key) {
        try {
            return jsonObject.getString(key);
        } catch (JSONException ex) {
            return null;
        }
    }

    public static Integer getIntegerFromJSONObject(JSONObject jsonObject, String key) {
        try {
            return jsonObject.getInt(key);
        } catch (JSONException ex) {
            return null;
        }
    }

    public static Long getLongFromJSONObject(JSONObject jsonObject, String key) {
        try {
            return jsonObject.getLong(key);
        } catch (JSONException ex) {
            return null;
        }
    }
}
