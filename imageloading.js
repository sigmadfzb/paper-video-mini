var imgPath = ["1.jpg","2.jpg","3.jpg"];
$(document).ready(function()
{
    cacheImage();
});

function cacheImage()
{
    
    var sLen= imgPath.length;
    var i;
    
    for(i=0;i<sLen;i++)
    {
        var url = "http://file.caixin.com/datanews/xxx/images/" + imgPath[i];
        var img = new Image();
        img.src = url;
        img.onload = function()
        {
            // 计数器累加
            loadSourcPicCount ++;

            if(loadSourcPicCount == sLen)
            {
                // 因为图片加载完的次序是不确定的，所以可以通过已经完成加载的图片总量来判断所有图片是否加载完成。如加载完成，再执行页面的显示。
                showPage();
            }
        }
    }
}

