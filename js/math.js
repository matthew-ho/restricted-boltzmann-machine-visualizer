randn = function() {
    // generate random guassian distribution number. (mean : 0, standard deviation : 1)
    var v1, v2, s;

    do {
        v1 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
        v2 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
        s = v1 * v1 + v2 * v2;
    } while (s >= 1 || s == 0);

    s = Math.sqrt( (-2 * Math.log(s)) / s );
    return v1 * s;
}

shape = function(mat) {
    var row = mat.length;
    var col = mat[0].length;
    return [row,col];
};

addVec = function(vec1, vec2) {
    if(vec1.length === vec2.length) {
        var result = [];
        var i;
        for(i=0;i<vec1.length;i++)
            result.push(vec1[i]+vec2[i]);
        return result;
    } else {
        throw new Error("Length Error : not same.")
    }
}

minusVec = function(vec1,vec2) {
    if(vec1.length === vec2.length) {
        var result = [];
        var i;
        for(i=0;i<vec1.length;i++)
            result.push(vec1[i]-vec2[i]);
        return result;
    } else {
        throw new Error("Length Error : not same.")
    }
};

addMatScalar = function(mat,scalar) {
    var row = shape(mat)[0];
    var col = shape(mat)[1];
    var i , j,result = [];
    for(i=0 ; i<row ; i++) {
        var rowVec = [];
        for(j=0 ; j<col ; j++) {
            rowVec.push(mat[i][j] + scalar);
        }
        result.push(rowVec);
    }
    return result;
}

addMatVec = function(mat,vec) {
    if(mat[0].length === vec.length) {
        var result = [];
        var i;
        for(i=0;i<mat.length;i++)
            result.push(addVec(mat[i],vec));
        return result;
    } else {
        throw new Error("Length Error : not same.")
    }
}

minusMatVec = function(mat,vec) {
    if(mat[0].length === vec.length) {
        var result = [];
        var i;
        for(i=0;i<mat.length;i++)
            result.push(minusVec(mat[i],vec));
        return result;
    } else {
        throw new Error("Length Error : not same.")
    }
}

addMat = function (mat1, mat2) {
    if ((mat1.length === mat2.length) && (mat1[0].length === mat2[0].length)) {
        var result = new Array(mat1.length);
        for (var i = 0; i < mat1.length; i++) {
            result[i] = new Array(mat1[i].length);
            for (var j = 0; j < mat1[i].length; j++) {
                result[i][j] = mat1[i][j] + mat2[i][j];
            }
        }
        return result;
    } else {
        throw new Error('Matrix mismatch.');
    }
};

minusMat = function(mat1, mat2) {
    if ((mat1.length === mat2.length) && (mat1[0].length === mat2[0].length)) {
        var result = new Array(mat1.length);
        for (var i = 0; i < mat1.length; i++) {
            result[i] = new Array(mat1[i].length);
            for (var j = 0; j < mat1[i].length; j++) {
                result[i][j] = mat1[i][j] - mat2[i][j];
            }
        }
        return result;
    } else {
        throw new Error('Matrix mismatch.');
    }
}

transpose = function (mat) {
    var result = new Array(mat[0].length);
    for (var i = 0; i < mat[0].length; i++) {
        result[i] = new Array(mat.length);
        for (var j = 0; j < mat.length; j++) {
            result[i][j] = mat[j][i];
        }
    }
    return result;
};

dotVec = function (vec1, vec2) {
    if (vec1.length === vec2.length) {
        var result = 0;
        for (var i = 0; i < vec1.length; i++) {
            result += vec1[i] * vec2[i];
        }
        return result;
    } else {
        throw new Error("Vector mismatch");
    }
};

outerVec = function (vec1,vec2) {
    var mat1 = transpose([vec1]);
    var mat2 = [vec2];
    return mulMat(mat1,mat2);
};

mulVecScalar = function(vec,scalar) {
    var i, result = [];
    for(i=0;i<vec.length;i++)
        result.push(vec[i]*scalar);
    return result;
};

mulMatScalar = function(mat,scalar) {
    var row = shape(mat)[0];
    var col = shape(mat)[1];
    var i , j,result = [];
    for(i=0 ; i<row ; i++) {
        var rowVec = [];
        for(j=0 ; j<col ; j++) {
            rowVec.push(mat[i][j] * scalar);
        }
        result.push(rowVec);
    }
    return result;
};

mulMatElementWise = function(mat1, mat2) {
    if (mat1.length === mat2.length && mat1[0].length === mat2[0].length) {
        var result = new Array(mat1.length);

        for (var x = 0; x < mat1.length; x++) {
            result[x] = new Array(mat1[0].length);
        }

        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < result[i].length; j++) {
                result[i][j] = mat1[i][j] * mat2[i][j]
            }
        }
        return result;
    } else {
        throw new Error("Matrix shape error : not same");
    }
};

mulMat = function (mat1, mat2) {
    if (mat1[0].length === mat2.length) {
        var result = new Array(mat1.length);

        for (var x = 0; x < mat1.length; x++) {
            result[x] = new Array(mat2[0].length);
        }


        var mat2_T = transpose(mat2);
        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < result[i].length; j++) {
                result[i][j] = dotVec(mat1[i],mat2_T[j]);
            }
        }
        return result;
    } else {
        throw new Error("Array mismatch");
    }
};

sumVec = function(vec) {
    var sum = 0;
    var i = vec.length;
    while (i--) {
        sum += vec[i];
    }
    return sum;
};

sumMat = function(mat) {
    var sum = 0;
    var i = mat.length;
    while (i--) {
        for(var j=0;j<mat[0].length;j++)
          sum += mat[i][j];
    }
    return sum;
};

sumMatAxis = function(mat,axis) {
    // default axis 0;
    // axis 0 : mean of col vector . axis 1 : mean of row vector
    if(axis === 1) {
        var row = shape(mat)[0];
        var i ;
        var result = [];
        for(i=0 ; i<row; i++)
            result.push(sumVec(mat[i]));
        return result;
    } else {
        mat_T = transpose(mat);
        return sumMatAxis(mat_T,1);
    }
};

meanVec = function(vec) {
    return 1. * sumVec(vec) / vec.length;
};

meanMat = function(mat) {
    var row = mat.length;
    var col = mat[0].length;
    return 1. * sumMat(mat) / (row * col);
};

meanMatAxis = function(mat,axis) {
    // default axis 0;
    // axis 0 : mean of col vector . axis 1 : mean of row vector
    if(axis === 1) {
        var row = shape(mat)[0];
        var i ;
        var result = [];
        for(i=0 ; i<row; i++)
            result.push(meanVec(mat[i]));
        return result;
    } else {
        mat_T = transpose(mat);
        return meanMatAxis(mat_T,1);
    }
};

squareVec = function(vec) {
    var squareVec = [];
    var i;
    for(i=0;i<vec.length;i++) {
        squareVec.push(vec[i]*vec[i]);
    }
    return squareVec;
};

squareMat = function(mat) {
    var squareMat = [];
    var i;
    for(i=0;i<mat.length;i++) {
        squareMat.push(squareVec(mat[i]));
    }
    return squareMat;
};

minVec = function(vec) {
    var min = vec[0];
    var i = vec.length;
    while (i--) {
        if (vec[i] < min)
            min = vec[i];
    }
    return min;
};

maxVec = function(vec) {
    var max = vec[0];
    var i = vec.length;
    while (i--) {
        if (vec[i] > max)
            max = vec[i];
    }
    return max;
}

minMat = function(mat) {
    var min = mat[0][0];
    var i = mat.length;
    while (i--) {
        for(var j=0;j<mat[0].length;j++) {
            if(mat[i][j] < min)
                min = mat[i][j];
        }
    }
    return min;
};

maxMat = function(mat) {
    var max = mat[0][0];
    var i = mat.length;
    while (i--) {
        for(var j=0;j<mat[0].length;j++) {
            if(mat[i][j] < max)
                max = mat[i][j];
        }
    }
    return max;
};

zeroVec = function(n) {
    var vec = [];
    while(vec.length < n)
        vec.push(0);
    return vec;
};

zeroMat = function(row,col) {
    var mat = [];
    while(mat.length < row)
        mat.push(zeroVec(col));
    return mat;
};

oneVec = function(n) {
    var vec = [];
    while(vec.length < n)
        vec.push(1);
    return vec;
};

oneMat = function(row,col) {
    var mat = [];
    while(mat.length < row)
        mat.push(oneVec(col));
    return mat;
};

randVec = function(n,lower,upper) {
    lower = (typeof lower !== 'undefined') ? lower : 0;
    upper = (typeof upper !== 'undefined') ? upper : 1;
    var vec = [];
    while(vec.length < n)
        vec.push(lower + (upper-lower) * Math.random());
    return vec;
};

randMat = function(row,col,lower,upper) {
    lower = (typeof lower !== 'undefined') ? lower : 0;
    upper = (typeof upper !== 'undefined') ? upper : 1;
    var mat = [];
    while(mat.length < row)
        mat.push(randVec(col,lower,upper));
    return mat;
};

randnVec = function(n,mean,sigma) {
    var vec = [];
    while(vec.length < n)
        vec.push(mean+sigma* randn());
    return vec;
};

randnMat = function(row,col,mean,sigma) {
    var mat = [];
    while(mat.length < row)
        mat.push(randnVec(col,mean,sigma));
    return mat;
};

identity = function (n) {
    var result = new Array(n);

    for (var i = 0; i < n ; i++) {
        result[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            result[i][j] = (i === j) ? 1 : 0;
        }
    }

    return result;
};

sigmoid = function(x) {
    var sigmoid = (1. / (1 + Math.exp(-x)))
    if(sigmoid ==1) {
     //   console.warn("Something Wrong!! Sigmoid Function returns 1. Probably javascript float precision problem?\nSlightly Controlled value to 1 - 1e-14")
        sigmoid = 0.99999999999999; // Javascript Float Precision Problem.. This is a limit of javascript.
    } else if(sigmoid ==0) {
      //  console.warn("Something Wrong!! Sigmoid Function returns 0. Probably javascript float precision problem?\nSlightly Controlled value to 1e-14")
        sigmoid = 1e-14;
    }
    return sigmoid; // sigmoid cannot be 0 or 1;;
};

dSigmoid = function(x){
    a = sigmoid(x);
    return a * (1. - a);
};

probToBinaryMat = function(mat) {
    var row = shape(mat)[0];
    var col = shape(mat)[1];
    var i,j;
    var result = [];

    for(i=0;i<row;i++) {
        var rowVec = [];
        for(j=0;j<col;j++) {
            if(Math.random() < mat[i][j])
                rowVec.push(1);
            else
                rowVec.push(0);
        }
        result.push(rowVec);
    }
    return result;
};

activateVec = function(vec,activation) {
    var i, result = [];
    for(i=0;i<vec.length;i++)
        result.push(activation(vec[i]));
    return result;
};

activateMat = function(mat,activation) {
    var row = shape(mat)[0];
    var col = shape(mat)[1];
    var i, j,result = [];
    for(i=0;i<row;i++) {
        var rowVec = [];
        for(j=0;j<col;j++)
            rowVec.push(activation(mat[i][j]));
        result.push(rowVec);
    }
    return result;
};

activateTwoVec = function(vec1, vec2,activation) {
    if (vec1.length === vec2.length) {
        var result = new Array(vec1.length);
        for (var i = 0; i < result.length; i++) {
            result[i] = activation(vec1[i],vec2[i]);
        }
        return result;
    } else {
        throw new Error("Matrix shape error : not same");
    }
};

activateTwoMat = function(mat1, mat2,activation) {
    if (mat1.length === mat2.length && mat1[0].length === mat2[0].length) {
        var result = new Array(mat1.length);

        for (var x = 0; x < mat1.length; x++) {
            result[x] = new Array(mat1[0].length);
        }

        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < result[i].length; j++) {
                result[i][j] = activation(mat1[i][j],mat2[i][j]);
            }
        }
        return result;
    } else {
        throw new Error("Matrix shape error : not same");
    }
};

fillVec = function(n,value) {
    var vec = [];
    while(vec.length < n)
        vec.push(value);
    return vec;
};

fillMat = function(row,col,value) {
    var mat = [];
    while(mat.length < row) {
        var rowVec = [];
        while(rowVec.length < col)
            rowVec.push(value);
        mat.push(rowVec);
    }
    return mat;
};

softmaxVec = function(vec) {
    var max = maxVec(vec);
    var preSoftmaxVec = activateVec(vec,function(x) {return Math.exp(x - max);})
    return activateVec(preSoftmaxVec,function(x) {return x/ sumVec(preSoftmaxVec)})
};

softmaxMat = function(mat) {
    var result=[], i;
    for(i=0 ; i<mat.length ; i++)
        result.push(softmaxVec(mat[i]));
    return result;
};
