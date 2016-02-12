/**
 * Created by Z.JM on 2015/11/17.
 */

/*! IMAGE-ANALISE v1.0 | (c) 2005 ZSMERTER | SM.XY(�Կ���) */

/* RGBAPixelԪ���� */
function RGBAPixel(red_, green_, blue_, alpha_) {
    this.red = red_;
    this.green = green_;
    this.blue = blue_;
    this.alpha = alpha_;
}
;

/* IMAGEDATA ת�� RGBAPixel���� */
function imageData2RGBAPixels(imageData_, width_) {
    var _RGBAPixelArray = [];
    for (var i = 0, n = imageData_.length; i < n; i += 4) {
        _RGBAPixelArray.push(new RGBAPixel(imageData_[i + 0], imageData_[i + 1], imageData_[i + 2], imageData_[i + 3]));
    }
    if (width_) {
        var _RGBAPixelArray2D = [];
        for (var i = 0, n = _RGBAPixelArray.length; i < n; i++) {
            if (i % width_ == 0) {
                _RGBAPixelArray2D.push([]);
            }
            _RGBAPixelArray2D[parseInt(i / width_)].push(_RGBAPixelArray[i]);
        }
        return _RGBAPixelArray2D;
    } else {
        return _RGBAPixelArray;
    }
}
;

/* IMAGE ת�� IMAGEDATA */
function getImageData(imagePath_, callback_) {
    var _canvas = document.createElement("canvas");
    var _image = new Image();
    _image.src = imagePath_;
    _image.onload = function () {
        var _width = _image.width;
        var _height = _image.height;

        _canvas.width = _width;
        _canvas.height = _height;

        var _contxet = _canvas.getContext("2d");
        _contxet.drawImage(_image, 0, 0);

        var _imageData = _contxet.getImageData(0, 0, _width, _height).data;
        if (callback_ && typeof(callback_) === 'function') {
            callback_.call(_image, _imageData);
        }
    }
}
;

/* �����㷨 �����ط������ص�booealֵ*/
function imagePixelAnalyse(featuresPixelGT, featuresPixelLT, RGBAPixelPixelArray, is2D) {
    if (is2D) {
        for (var i = 0, n = RGBAPixelPixelArray.length; i < n; i++) {
            for (var j = 0, m = RGBAPixelPixelArray[i].length; j < m; j++) {
                RGBAPixelPixelArray[i][j] = imagePixelAnalyseRuleGT(featuresPixelGT, RGBAPixelPixelArray[i][j]) && imagePixelAnalyseRuleLT(featuresPixelLT, RGBAPixelPixelArray[i][j]);
            }
        }
    } else {
        for (var i = 0, n = RGBAPixelPixelArray.length; i < n; i++) {
            RGBAPixelPixelArray[i] = imagePixelAnalyseRule(featuresPixelPixel, RGBAPixelPixelArray[i]);
        }
    }
}
;

/* �����㷨���򣺲������� ������������ */
function imagePixelAnalyseRuleGT(featuresPixelPixel_, RGBAPixelPixel_) {
    var analyseResult = true;
    if (featuresPixelPixel_) {
        if (featuresPixelPixel_.red) {
            analyseResult = analyseResult && (RGBAPixelPixel_.red >= featuresPixelPixel_.red ? true : false);
        }
        if (featuresPixelPixel_.green) {
            analyseResult = analyseResult && (RGBAPixelPixel_.green >= featuresPixelPixel_.green ? true : false);
        }
        if (featuresPixelPixel_.blue) {
            analyseResult = analyseResult && (RGBAPixelPixel_.blue >= featuresPixelPixel_.blue ? true : false);
        }
        if (featuresPixelPixel_.alpha) {
            analyseResult = analyseResult && (RGBAPixelPixel_.alpha >= featuresPixelPixel_.alpha ? true : false);
        }
    }
    return analyseResult;
}
;

/* �����㷨���� �� ��������С���������� */
function imagePixelAnalyseRuleLT(featuresPixelPixel_, RGBAPixelPixel_) {
    var analyseResult = true;
    if (featuresPixelPixel_) {
        if (featuresPixelPixel_.red) {
            analyseResult = analyseResult && (RGBAPixelPixel_.red <= featuresPixelPixel_.red ? true : false);
        }
        if (featuresPixelPixel_.green) {
            analyseResult = analyseResult && (RGBAPixelPixel_.green <= featuresPixelPixel_.green ? true : false);
        }
        if (featuresPixelPixel_.blue) {
            analyseResult = analyseResult && (RGBAPixelPixel_.blue <= featuresPixelPixel_.blue ? true : false);
        }
        if (featuresPixelPixel_.alpha) {
            analyseResult = analyseResult && (RGBAPixelPixel_.alpha <= featuresPixelPixel_.alpha ? true : false);
        }
    }
    return analyseResult;
}
;

/* �����㷨 �����ط������ص�����ٷֱ�ֵ*/
function imageAreaAnalyse(RGBAPixelPixelArray, areaPixel, areaScale) {
    var imageAreaAnalyseTureCount = 0;
    var imageAreaAnalyseFalseCount = 0;

    function validateAreaScale(sx, sy, ex, ey) {
        var tureCount = 0;
        var falseCount = 0;
        for (var i = sx; i < ex; i++) {
            for (var j = sy; j < ey; j++) {
                if (sx <= i && i <= sy && ex <= j && j <= ey) {
                    if (RGBAPixelPixelArray[i][j]) {
                        imageAreaAnalyseTureCount++;
                    } else {
                        imageAreaAnalyseFalseCount++;
                    }
                }
            }
        }
        return imageAreaAnalyseTureCount / (imageAreaAnalyseTureCount + imageAreaAnalyseFalseCount) * 100 >= areaScale;
    }

    var indexX = 0;
    var indexY = 0;
    for (var i = areaPixel, n = RGBAPixelPixelArray.length; i < n; i += areaPixel) {
        for (var j = areaPixel, m = RGBAPixelPixelArray[i].length; j < m; j += areaPixel) {
            if (validateAreaScale(indexX, indexY, i, j)) {
                imageAreaAnalyseTureCount++;
            } else {
                imageAreaAnalyseFalseCount++;
            }
            indexY = j;
        }
        indexX = i;
    }

    return imageAreaAnalyseTureCount / (imageAreaAnalyseTureCount + imageAreaAnalyseFalseCount) * 100;
};
