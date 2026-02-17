package sof2week02softwarelab;

public class TextUtils {

    public static int toBase10(String binary){
        int result = 0;
        int lenny = binary.length()-1;
        for (int i = lenny; i >= 0; i--) {
            if (binary.charAt(i) == '1') {
                result += Math.pow(2, lenny-i);
            }
        }


        return result;
    }
    
    public static String[] split(String text){

        
        return new String[]{""};
    }
}
