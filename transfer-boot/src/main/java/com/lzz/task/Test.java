package com.lzz.task;

import com.lzz.entity.Datacolumn;

import java.sql.Connection;
import java.util.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
public class Test {
	public static void main(String[] args) {
		try {
			String strHex3 = "E0330";
			//将十六进制转化成十进制
			int valueTen2 = Integer.parseInt(strHex3,16);
			//long tim = System.currentTimeMillis()/1000;
			System.out.println(valueTen2);
			System.out.println(System.currentTimeMillis());
			Class.forName("com.microsoft.jdbc.sqlserver.SQLServerDriver");
					//.newInstance();
			Connection con = DriverManager
					.getConnection(
							//"jdbc:microsoft:sqlserver://172.20.18.134:1433;databaseName=MASTER1",
							"jdbc:microsoft:sqlserver://10.20.12.8:1433;databaseName=ecis",
							"sa", "123");
			Datacolumn[] columns = new Datacolumn[] {
					new Datacolumn("id", Types.INTEGER),
					new Datacolumn("code", Types.CHAR, 10),
					new Datacolumn("name", Types.VARCHAR),
					new Datacolumn("date", Types.DATE),
					new Datacolumn("memo", Types.VARCHAR) };

			PreparedStatement pstm = con
					.prepareStatement("SELECT allocunitname,operation,[RowLog Contents 0] as r0,[RowLog Contents 1]as r1 from::fn_dblog (null, null) where  allocunitname='dbo.Table_2' and operation in('LOP_INSERT_ROWS','LOP_DELETE_ROWS')");
			ResultSet rs = pstm.executeQuery();
			while (rs.next()) {

				byte[] data = (byte[]) rs.getBytes("r0");
				// System.out.println(new String(data));
				translateData(data, columns);
				System.out.println("数据对象" + rs.getString("allocunitname") + "的"
						+ rs.getString("operation") + "操作:");
				for (int i = 0; i < columns.length; i++) {
					System.out.println(columns[i].getName() + "="
							+ columns[i].getValue());
				}

			}
			System.out.println();
			rs.close();
			pstm.close();
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void translateData(byte[] data, Datacolumn[] columns) {
		int index = 4;
		for (int i = 0; i < columns.length; i++) {
			switch (columns[i].getDataType()) {
				case Types.CHAR:
					// 读取定长字符串，需要根据表结构指定长度
					byte[] bytec = new byte[] { data[index], data[index + 1],
							data[index + 2], data[index + 3], data[index + 4],
							data[index + 5], data[index + 6], data[index + 7],
							data[index + 8], data[index + 9] };
					columns[i].setValue(new String(bytec));
					index += columns[i].getLength();
					break;
				case Types.DATE:
					SimpleDateFormat   time=new   SimpleDateFormat( "yyyy-MM-dd HH:mm:ss");
					//读取datetime字段，sql为8字节保存
					Date date1=new Date();
					try {
						date1 = time.parse("1900-01-01 00:00:00");
					} catch (ParseException e) {
						e.printStackTrace();
					}
					//前四位1/300秒保存
					byte[] bytetime = new byte[] { data[index + 3], data[index + 2],
							data[index + 1], data[index] };
					int datetimet=byteArrayToint32(bytetime);
					int second = datetimet;
					Calendar   calendar   =   new   GregorianCalendar();
					calendar.setTime(date1);
					calendar.add(calendar.SECOND,second/300);
					index += 4;
					//后四位1900-1-1的天数
					byte[] bytedate = new byte[] { data[index + 3], data[index + 2],
							data[index + 1], data[index] };
					int datetimed=byteArrayToint32(bytedate);
					int days =datetimed;
					calendar.add(calendar.DATE,days);
					index += 4;
					columns[i].setValue(time.format(calendar.getTime()));
					break;
				case Types.INTEGER:
					// 读取int字段,为4个字节保存
					byte[] bytea = new byte[] { data[index + 3], data[index + 2],
							data[index + 1], data[index] };
					int aaa = byteArrayToint32(bytea);
					columns[i].setValue(aaa);
					index += 4;
					break;
				default:
					// 忽略不定长字段和其他不支持以及不愿意考虑的字段
					break;
			}
		}
		// 跳过三个字节
		index += 3;
		// 取变长字段的数量,保存两个字节
		byte[] bytevarchar1 = new byte[] { data[index+1], data[index] };
		short tempvarchar1 = byteArrayToint16(bytevarchar1);
		index += 2;
		// 接下来,每两个字节保存一个变长字段的结束位置,
		// 所以第一个变长字段的开始位置可以算出来
		short startIndex = (short) (index + tempvarchar1 * 2);
       // short startIndex = (short) (index + tempvarchar1);
		// 第一个变长字段的结束位置也可以算出来
		byte[] bytevarchar2 = new byte[] { data[index+1], data[index] };
		short  tempvarchar2 = byteArrayToint16(bytevarchar2);
		short  endIndex =tempvarchar2;
		// 循环变长字段列表读取数据
		for (int i = 0; i < columns.length; i++) {
			switch (columns[i].getDataType()) {
				case Types.VARCHAR:
					// 根据开始和结束位置，可以算出来每个变长字段的值
					byte[] bytec = new byte[endIndex-startIndex];
					for(int j=0;j<endIndex-startIndex;j++){
						bytec[j]=data[startIndex+j];
					}
					columns[i].setValue(new String(bytec));
					// 下一个变长字段的开始位置
					startIndex = endIndex;
					// 获取下一个变长字段的结束位置
					index += 2;
					byte[] bytevarchar3 = new byte[] { data[index+1], data[index] };
					short tempvarchar3 = byteArrayToint16(bytevarchar3);
					endIndex = tempvarchar3;
					break;
				default:
					// 忽略定长字段和其他不支持以及不愿意考虑的字段
					break;
			}
		}
		// 获取完毕

	}

	public static int byteArrayToint32(byte[] b) {
		int mask = 0xff;
		int temp = 0;
		int res = 0;
		for (int i = 0; i < 4; i++) {
			res <<= 8;
			temp = b[i] & mask;
			res |= temp;
		}
		return res;
	}

	public static short byteArrayToint16(byte[] b) {
		short r=0;
		for (int i = 0; i < 2; i++) {
			r <<= 8;
			r |= (b[i] & 0x00ff);
		}
		return r;
	}
}
