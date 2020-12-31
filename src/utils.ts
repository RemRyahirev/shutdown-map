const MEAN_NUMBERS = 5;

export function format(
  num: number,
  splitGroups = true,
): string {
  let [int, dec] = String(num).split('.');

  const intLen = int.length;
  if (intLen >= MEAN_NUMBERS) {
    dec = null;
  } else if (dec) {
    const neededPrecision = MEAN_NUMBERS - intLen;
    if (neededPrecision < dec.length) {
      const rest = dec.length - neededPrecision;
      dec = String(Math.round(Number(dec) / 10 ** rest));

      if (dec.length > neededPrecision) {
        int = String(Number(int) + 1);
        dec = dec.substr(1);
      }

      dec = dec.replace(/0+$/, '');
    }
  }

  return (splitGroups ? int.replace(/\d(?=(\d{3})+$)/g, '$& ') : int) +
    (dec ? `.${dec}` : '');
}
