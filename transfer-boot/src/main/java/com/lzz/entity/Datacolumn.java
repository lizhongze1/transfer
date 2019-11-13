package com.lzz.entity;

/**
 *
 * 　  * @className: Datacolumn
 *
 * @description TODO
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date  15:30
 *
 */
public class Datacolumn {
    public String name;
    public int dataType;
    public int length = -1;
    public Object value = null;

    public Datacolumn(String name, int dataType) {
        this.name = name;
        this.dataType = dataType;
    }

    public Datacolumn(String name, int dataType, int length) {
        this.name = name;
        this.dataType = dataType;
        this.length = length;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDataType() {
        return this.dataType;
    }

    public void setDataType(int dataType) {
        this.dataType = dataType;
    }

    public int getLength() {
        return this.length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public Object getValue() {
        return this.value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
