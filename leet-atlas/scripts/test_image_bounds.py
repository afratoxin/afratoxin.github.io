import unittest
from PIL import Image, ImageDraw
from build_image_bounds import detect_bounds

class ContentBoundsTests(unittest.TestCase):
    def test_white_footer_is_excluded_without_removing_faint_diagram_or_options(self):
        image=Image.new('RGB',(200,600),'white')
        draw=ImageDraw.Draw(image)
        draw.rectangle((20,14,180,100),fill='black')
        draw.line((30,130,175,160),fill=(210,210,210),width=2)
        draw.rectangle((21,220,60,229),fill=(100,100,100))
        left,top,right,bottom=detect_bounds(image)
        self.assertLess(bottom,250)
        self.assertGreaterEqual(bottom,230)
        for x in range(image.width):
            for y in range(image.height):
                if min(image.getpixel((x,y)))<240:
                    self.assertTrue(left<=x<right and top<=y<bottom)
    def test_edge_content_and_empty_images_are_safe(self):
        image=Image.new('RGB',(30,40),'white')
        ImageDraw.Draw(image).point((0,39),fill='black')
        self.assertEqual(detect_bounds(image),(0,33,7,40))
        self.assertEqual(detect_bounds(Image.new('RGB',(30,40),'white')),(0,0,30,40))

if __name__=='__main__':unittest.main()
