export class DataDecoder {
   static feltToStr = (felt: number) => {
      let hex = felt.toString(16);
      if (hex.length % 2 !== 0) {
         hex = "0" + hex;
      }
      const text = Buffer.from(hex, "hex").toString("utf8");
      return text;
   };

   static feltToInt = ({ low, high }: any) => {
      return Number((BigInt(high) << 64n) + BigInt(low));
   };
}
