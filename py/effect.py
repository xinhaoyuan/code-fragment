#!/usr/bin/env python

import sys;
import Image, ImageDraw;

class Methods:
    def line(self, img, line_color = "black", mult = 10, spacing = 2, scale = 2):
        # mult should be at least spacing * 2
        # and be divible by scale

        if ((img.size[0] % mult != 0) or (img.size[1] % mult != 0)):
            print "width or height cannot be divied by " + str(mult);
            sys.exit(1);

        output = Image.new("RGBA", (img.size[0] * scale, img.size[1] * scale));
        dr = ImageDraw.Draw(output);
        for y_base in xrange(0, output.size[1] / mult):
            # draw the line for every mult pixel height
            path_points = [0, y_base * mult + spacing];
            for x_base in xrange(0, output.size[0] / mult):
                # Calculate the average grayscale of the multxmult region
                gray_sum = 0;
                for x_off in xrange(0, mult / scale):
                    for y_off in xrange(0, mult / scale):
                        px = img.getpixel((x_base * mult / scale + x_off, y_base * mult / scale + y_off));
                        # calculate the gray scale
                        gray = (px[0] * 299 + px[1] * 587 + px[2] * 114 + 500) / 1000;
                        gray_sum = gray_sum + gray;
                gray_avg = gray_sum / (mult / scale) ** 2;
                # the bar height, between 0~7
                b_height = int((255 - gray_avg) / 256.0 * (mult - spacing));
                path_points.extend([x_base * mult + spacing, y_base * mult + spacing + b_height, 
                                    x_base * mult + (mult - spacing), y_base * mult + spacing + b_height]);
            # wrap the path back
            path_points.extend([output.size[0], y_base * mult + spacing, output.size[0], y_base * mult, 0, y_base * mult]);
            dr.polygon(path_points, fill = line_color);

        del dr;
        
        return output;

if (len(sys.argv) < 4):
    print "Usage: " + sys.argv[0] + " method input-file output-file [args ...]"
    sys.exit(1);

methods = Methods();

method = sys.argv[1];
image_in = Image.open(sys.argv[2]);
image_out_name = sys.argv[3];

args = {};

image_out = getattr(methods, method)(image_in, **args);

image_out.save(image_out_name);
