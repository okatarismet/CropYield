import sys 
import cv2
import numpy as np
import os
import glob
# import tensorflow as tf



print("[INFO] loading images...")
data = []
labels = []
# images_paths = glob.glob("./Mango/ValidationSet1-10Photos-JPG/*.jpg")
images_paths = glob.glob("../Nodejs/uploads/*.jpg")
labels = []

# Image x axis
imgx = 10
# Image y axis
imgy = 10
# output size
output = 683 
for single_path in images_paths[0:1]:
    image = cv2.imread(single_path)
    # cv2.imshow('image',image)
    # cv2.waitKey(0)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.resize(image,(imgx,imgy))
    image = image.flatten()
    os.remove(single_path)
    print(image)






# print(92449000)
  
