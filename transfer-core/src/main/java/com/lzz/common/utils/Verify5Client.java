package com.lzz.common.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Timer;
import java.util.TimerTask;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.commons.codec.digest.DigestUtils;

import com.google.gson.Gson;

public class Verify5Client {

	private Timer timer = new Timer();

	private String appid;

	private String appkey;

	private String host;

	public Verify5Client(String host,String appid,String appkey) {
		this.appid=appid;
		this.appkey=appkey;
		this.host=host;
	}

	public boolean sveirfy(String verifyId, Map<String,String> extra) throws Exception {
		String token=getTokenData().get("token");
		Map<String,String> params=new HashMap<>();
		if(extra!=null) {
			params.putAll(extra);
		}
		params.put("token", token);
		params.put("verifyid", verifyId);
		params.put("timestamp", ""+System.currentTimeMillis());
		String sign=calcSignature(appkey, params);
		params.put("signature", sign);
		try {
			String baseurl="https://"+host;
			String json=get(baseurl,"/openapi/verify",params);
			System.out.println(json);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	private String get(String baseurl,String relativeurl,Map<String,String> params) throws Exception{
		StringBuffer urlbuf=new StringBuffer();
		urlbuf.append(baseurl).append(relativeurl);
		if(!params.isEmpty()) {
			urlbuf.append("?");
			for(Entry<String, String> entry:params.entrySet()) {
				String key=entry.getKey();
				String value=entry.getValue();
				try {
					urlbuf.append("&").append(key).append("=").append(URLEncoder.encode(value, "UTF-8"));
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
			}
		}
		String url=urlbuf.toString();
		System.out.println("Requesting "+url);
		BufferedReader r = null;
		HttpURLConnection conn =null;
		try {
			URL u = new URL(url);
			conn =  (HttpURLConnection) u.openConnection();
			conn.setConnectTimeout(5 * 1000);
			conn.setReadTimeout(30 * 1000);
			if(url.startsWith("https:")) {
				HttpsURLConnection https = (HttpsURLConnection)conn;
				https.setHostnameVerifier(DO_NOT_VERIFY);
				trustAllHosts(https);
			}
			conn.connect();
			r = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			StringBuffer buf = new StringBuffer();
			String line = null;
			while ((line = r.readLine()) != null) {
				buf.append(line).append("\n");
			}
			return buf.toString();
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		} finally {
			if (r != null) {
				try {
					r.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if(conn!=null) {
				conn.disconnect();
			}
		}
	}

	@SuppressWarnings("unchecked")
	public void refreshToken() {
		Map<String,String> params=new HashMap<>();
		long time = java.util.Calendar.getInstance().getTime().getTime();
		params.put("appid", appid);
		params.put("timestamp", ""+time);
		try {
			/**calc signature*/
			Map<String ,String> signMap = new HashMap<String,String>();
			signMap.put("appid",appid);
			signMap.put("timestamp",String.valueOf(time));
			String signature=calcSignature(appkey,signMap);
			params.put("signature", signature);
			String baseurl="https://"+host;
			String json = get(baseurl,"/openapi/getToken", params);
			Gson gson=new Gson();
			System.out.println(json);
			Map<String,Object> map = gson.fromJson(json, Map.class);
			boolean success=(boolean) map.get("success");
			if(success) {
				Map<String,String> data=(Map<String, String>) map.get("data");
				if(data!=null&&data.containsKey("expiresIn")&&data.containsKey("token")) {
					String sExpiresIn=data.get("expiresIn");
					long expiresIn=Long.valueOf(sExpiresIn);
					long expiresTime=System.currentTimeMillis()+expiresIn;
					data.put("expiresTime", ""+expiresTime);
					tokenData=data;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * generate signature
	 * @param secretKey
	 * @param params
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public String calcSignature(String appkey, Map<String, String> params) throws UnsupportedEncodingException{
	    // 1. sort by ASCII
	    String[] keys = params.keySet().toArray(new String[0]);
	    Arrays.sort(keys);

	    // 2. joint
	    StringBuilder sb = new StringBuilder();
	    for (String key : keys) {
	        sb.append(key).append(params.get(key));
	    }
	    // 3. append appkey
	    sb.append(appkey);

	    // 4. md5Hex
	    return DigestUtils.md5Hex(sb.toString().getBytes("UTF-8"));
	}

	private static final TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
		public X509Certificate[] getAcceptedIssuers() {
			return new X509Certificate[] {};
		}

		public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
		}

		public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
		}
	} };

	private static SSLSocketFactory trustAllHosts(HttpsURLConnection connection) {
		SSLSocketFactory oldFactory = connection.getSSLSocketFactory();
		try {
			SSLContext sc = SSLContext.getInstance("TLS");
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			SSLSocketFactory newFactory = sc.getSocketFactory();
			connection.setSSLSocketFactory(newFactory);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return oldFactory;
	};

	private static final HostnameVerifier DO_NOT_VERIFY = new HostnameVerifier() {
		public boolean verify(String hostname, SSLSession session) {
			return true;
		}
	};

	private Map<String,String> tokenData=null;

	public Map<String,String> getTokenData(){
		return tokenData;
	}

	public void destroy() {
		timer.purge();
	}

	public void init(int delay,int interval) {
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				refreshToken();
			}
		}, delay, interval);
	}
}
