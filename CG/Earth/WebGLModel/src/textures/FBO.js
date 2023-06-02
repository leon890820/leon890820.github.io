class FBO{
    constructor(gl){
        var framebuffer, texture, depthBuffer;
    
        function error(){
            if(framebuffer) gl.deleteFramebuffer(framebuffer);
            if(texture) gl.deleteFrameBuffer(texture);
            if(depthBuffer) gl.deleteFrameBuffer(depthBuffer);
            return null;
        }
        
        framebuffer = gl.createFramebuffer();
        if(!framebuffer){
            console.log("Can't not create frame buffer object.");
            return error();
        }
        texture = gl.createTexture();
        if(!texture){
            console.log("Can't not create texture buffer object.");
            return error();
        }
        
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,resolution,resolution,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        framebuffer.texture = texture;

        depthBuffer = gl.createRenderbuffer();
        if(!depthBuffer){
            console.log("Can't create depthbuffer object.");
            return error();
        }

        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, resolution, resolution);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER,depthBuffer);
    
        var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if(gl.FRAMEBUFFER_COMPLETE !== e){
                console.log("渲染缓冲区设置错误"+e.toString());
                return error();
            }
    
            //取消当前的focus对象
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    
        return framebuffer;

    }



}