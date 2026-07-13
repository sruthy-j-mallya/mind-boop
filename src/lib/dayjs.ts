import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(utc);

export default dayjs;
