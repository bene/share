// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { randomUUID } from "crypto";

const app = new Hono();

// const s3 = new S3Client({
//   region: process.env.S3_REGION as string,
//   forcePathStyle: true,
//   endpoint: process.env.S3_URL as string,
//   credentials: {
//     accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
//     secretAccessKey: process.env.S3_ACCESS_KEY_SECRET as string,
//   },
// });

app.post("/", (c) => {
  return streamText(c, async (stream) => {
    const formData = await c.req.formData();
    const files = formData.getAll("files").filter((f) => f instanceof File);

    for (const file of files) {
      const id = randomUUID();
      await stream.write(id);
      await stream.sleep(2000);
    }

    // await Promise.all(
    //   files.map(async (file) => {
    //     const id = randomUUID();
    //     const uploadCommand = new PutObjectCommand({
    //       Body: file,
    //       Bucket: process.env.S3_BUCKET as string,
    //       Key: file.name,
    //     });

    //     await s3.send(uploadCommand);
    //     await stream.write(id);
    //   }),
    // );

    await stream.close();
  });
});

export default app;
