import { AWSError } from 'aws-sdk';
import { PathParam } from '../../models/get-request/path-parameters';
import { QueryParams } from '../../models/get-request/query-parameters';
import { getS3Logs } from '../../utils/s3';

export const getLogsFromS3 = async (pathParam: PathParam, queryParams: QueryParams): Promise<string[]> => {
    const { group } = pathParam;
    const { date, from, to } = queryParams || {};
    const { year, month, day } = date ? { year: date.slice(0, 4), month: date.slice(5, 7), day: date.slice(8, 10) } : { year: '', month: '', day: '' };
  
    const fromHour = from ? from.split(':')[0] : '0';
    const fromMinute = from ? from.split(':')[1] : '0';
    const toHour = to ? to.split(':')[0] : '23';
    const toMinute = to ? to.split(':')[1] : '59';
  
    let logs: string[] = [];
  
    for (let hour = Number(fromHour); hour <= Number(toHour); hour++) {
      for (let minute = Number(fromMinute); minute <= Number(toMinute); minute++) {
        const key = `${group}/${year}/${month}/${day}/logs_${hour}_${minute}.log`;
        const bucketName = process.env.SAMPLE_BUCKET ?? '';
  
        try {
          const logsInMinute = await getS3Logs(bucketName, key);
          if (logsInMinute.length !== 0) {
            logs.push(...logsInMinute);
          }
        } catch (error) {
          console.error(`Error getting object from S3: ${error}`);
          if ((error as AWSError).code !== ('NotFound' || "NoSuchKey")) {
            console.log(`No logs found for ${key}: ${error}`)
          } else {
            throw error;
          }
        }
      }
    }
  
    return logs;
  }