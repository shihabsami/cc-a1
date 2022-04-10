import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.lambda.runtime.events.models.s3.S3EventNotification.S3EventNotificationRecord;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.google.common.io.Files;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import net.coobird.thumbnailator.Thumbnails;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class LambdaRequestHandler implements RequestHandler<S3Event, String> {

    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private static final int THUMBNAIL_WIDTH = 64;
    private static final int THUMBNAIL_HEIGHT = 64;
    private static final String DESTINATION_BUCKET = "cc-a1-thumbnail-bucket";

    @Override
    public String handleRequest(S3Event s3Event, Context context) {
        LambdaLogger logger = context.getLogger();
        logger.log("ENVIRONMENT VARIABLES " + gson.toJson(System.getenv()));
        logger.log("CONTEXT " + gson.toJson(context));
        logger.log(String.format("EVENT %s", gson.toJson(s3Event)));

        S3EventNotificationRecord record = s3Event.getRecords().get(0);
        String sourceBucket = record.getS3().getBucket().getName();
        String sourceObjectKey = record.getS3().getObject().getUrlDecodedKey();

        AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
        S3Object s3Object;
        try {
            s3Object = s3Client.getObject(new GetObjectRequest(sourceBucket, sourceObjectKey));
        } catch (AmazonServiceException exception) {
            logger.log(String.format("FAILURE Failed to download image %s/%s", sourceBucket, sourceObjectKey));
            throw new RuntimeException();
        }

        InputStream objectContent = s3Object.getObjectContent();
        BufferedImage image;
        try {
            image = ImageIO.read(objectContent);
        } catch (IOException exception) {
            logger.log("FAILURE Failed to read image");
            throw new RuntimeException();
        }

        logger.log(String.format("INFO Producing image thumbnail of dimensions %dx%d", THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT));
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            Thumbnails.of(image)
                      .size(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
                      .keepAspectRatio(false)
                      .outputFormat("jpeg")
                      .outputQuality(1)
                      .toOutputStream(outputStream);
        } catch (IOException e) {
            logger.log("FAILURE Failed to produce thumbnail");
            throw new RuntimeException();
        }

        byte[] byteArray = outputStream.toByteArray();
        ByteArrayInputStream inputStream = new ByteArrayInputStream(byteArray);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(outputStream.size());
        metadata.setContentType("image/jpeg");

        String destinationObjectKey = Files.getNameWithoutExtension(sourceObjectKey) +
                                      "_" + THUMBNAIL_WIDTH + "x" + THUMBNAIL_HEIGHT + ".jpeg" ;
        logger.log(String.format("INFO Uploading image as %s/%s", DESTINATION_BUCKET, destinationObjectKey));
        try {
            s3Client.putObject(DESTINATION_BUCKET, destinationObjectKey, inputStream, metadata);
        } catch (AmazonServiceException exception) {
            logger.log("FAILURE: Failed to upload image");
            throw new RuntimeException();
        }

        logger.log("SUCCESS Uploaded thumbnail image");
        return "OK";
    }

}
