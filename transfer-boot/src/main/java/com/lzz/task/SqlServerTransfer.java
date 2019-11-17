/*
package com.lzz.task;

import com.lzz.entity.Datacolumn;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.IJobHandler;
import com.xxl.job.core.handler.annotation.JobHandler;
import org.springframework.stereotype.Component;


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

*/
/**
 *
 * 　  * @className: SqlServerTransfer
 *
 * @description TODO
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date  15:04
 *
 *//*

@JobHandler(value="sqlServerTransfer")
@Component
public class SqlServerTransfer extends IJobHandler {
    @Override
    public ReturnT<String> execute(String param) throws Exception {
        try {
            Class.forName("com.microsoft.jdbc.sqlserver.SQLServerDriver")
                    .newInstance();
            Connection con = DriverManager
                    .getConnection(
                            "jdbc:microsoft:sqlserver://172.20.18.134:1433;databaseName=MASTER1",
                            "sa", "1qaz2wsx!");
            Datacolumn[] columns = new Datacolumn[] {
                    new Datacolumn("id", Types.INTEGER),
                    new Datacolumn("code", Types.CHAR, 10),
                    new Datacolumn("name", Types.VARCHAR),
                    new Datacolumn("date", Types.DATE),
                    new Datacolumn("memo", Types.VARCHAR) };

            PreparedStatement pstm = con
                    .prepareStatement("SELECT allocunitname,operation,[RowLog Contents 0] as r0,[RowLog Contents 1]as r1 from::fn_dblog (null, null) where allocunitname like 'dbo.log_test%'and operation in('LOP_INSERT_ROWS','LOP_DELETE_ROWS')");
            ResultSet rs = pstm.executeQuery();
            while (rs.next()) {

                byte[] data = (byte[]) rs.getBytes("r0");
                // System.out.println(new String(data));
                translateData(data, columns);
                System.out.println("���ݶ���" + rs.getString("allocunitname") + "��"
                        + rs.getString("operation") + "����:");
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
        return SUCCESS;
    }

    public static void translateData(byte[] data, Datacolumn[] columns) {
        int index = 4;
        for (int i = 0; i < columns.length; i++) {
            switch (columns[i].getDataType()) {
                case Types.CHAR:
                    // ��ȡ�����ַ�������Ҫ���ݱ�ṹָ������
                    byte[] bytec = new byte[] { data[index], data[index + 1],
                            data[index + 2], data[index + 3], data[index + 4],
                            data[index + 5], data[index + 6], data[index + 7],
                            data[index + 8], data[index + 9] };
                    columns[i].setValue(new String(bytec));
                    index += columns[i].getLength();
                    break;
                case Types.DATE:
                    SimpleDateFormat   time=new   SimpleDateFormat( "yyyy-MM-dd HH:mm:ss");
                    //��ȡdatetime�ֶΣ�sqlΪ8�ֽڱ���
                    Date date1=new Date();
                    try {
                        date1 = time.parse("1900-01-01 00:00:00");
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                    //ǰ��λ1/300�뱣��
                    byte[] bytetime = new byte[] { data[index + 3], data[index + 2],
                            data[index + 1], data[index] };
                    int datetimet=byteArrayToint32(bytetime);
                    int second = datetimet;
                    Calendar   calendar   =   new   GregorianCalendar();
                    calendar.setTime(date1);
                    calendar.add(calendar.SECOND,second/300);
                    index += 4;
                    //����λ1900-1-1������
                    byte[] bytedate = new byte[] { data[index + 3], data[index + 2],
                            data[index + 1], data[index] };
                    int datetimed=byteArrayToint32(bytedate);
                    int days =datetimed;
                    calendar.add(calendar.DATE,days);
                    index += 4;
                    columns[i].setValue(time.format(calendar.getTime()));
                    break;
                case Types.INTEGER:
                    // ��ȡint�ֶ�,Ϊ4���ֽڱ���
                    byte[] bytea = new byte[] { data[index + 3], data[index + 2],
                            data[index + 1], data[index] };
                    int aaa = byteArrayToint32(bytea);
                    columns[i].setValue(aaa);
                    index += 4;
                    break;
                default:
                    // ���Բ������ֶκ�������֧���Լ���Ը�⿼�ǵ��ֶ�
                    break;
            }
        }
        // ���������ֽ�
        index += 3;
        // ȡ�䳤�ֶε�����,���������ֽ�
        byte[] bytevarchar1 = new byte[] { data[index+1], data[index] };
        short tempvarchar1 = byteArrayToint16(bytevarchar1);
        index += 2;
        // ������,ÿ�����ֽڱ���һ���䳤�ֶεĽ���λ��,
        // ���Ե�һ���䳤�ֶεĿ�ʼλ�ÿ��������
        short startIndex = (short) (index + tempvarchar1 * 2);
        // ��һ���䳤�ֶεĽ���λ��Ҳ���������
        byte[] bytevarchar2 = new byte[] { data[index+1], data[index] };
        short  tempvarchar2 = byteArrayToint16(bytevarchar2);
        short  endIndex =tempvarchar2;
        // ѭ���䳤�ֶ��б��ȡ����
        for (int i = 0; i < columns.length; i++) {
            switch (columns[i].getDataType()) {
                case Types.VARCHAR:
                    // ���ݿ�ʼ�ͽ���λ�ã����������ÿ���䳤�ֶε�ֵ
                    byte[] bytec = new byte[endIndex-startIndex];
                    for(int j=0;j<endIndex-startIndex;j++){
                        bytec[j]=data[startIndex+j];
                    }
                    columns[i].setValue(new String(bytec));
                    // ��һ���䳤�ֶεĿ�ʼλ��
                    startIndex = endIndex;
                    // ��ȡ��һ���䳤�ֶεĽ���λ��
                    index += 2;
                    byte[] bytevarchar3 = new byte[] { data[index+1], data[index] };
                    short tempvarchar3 = byteArrayToint16(bytevarchar3);
                    endIndex = tempvarchar3;
                    break;
                default:
                    // ���Զ����ֶκ�������֧���Լ���Ը�⿼�ǵ��ֶ�
                    break;
            }
        }
        // ��ȡ���

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
*/
