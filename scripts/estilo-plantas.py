# Converte plantas renderizadas para o estilo do catálogo (paredes verdes, chão claro).
# Uso: python scripts/estilo-plantas.py public/img/plantas/t2.jpg public/img/plantas/estilo/t2.jpg
# Requer: pip install pillow numpy scipy
import sys, numpy as np
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(np.float32)
W = im.size[0]
L = (0.299*a[...,0]+0.587*a[...,1]+0.114*a[...,2])/255
warm = (a[...,0]-a[...,2])/255
GREEN = np.array([0x1F,0x45,0x3B],np.float32)
FLOOR = np.array([0xD5,0xD3,0xCC],np.float32)
FLOOR_D = np.array([0xB9,0xB8,0xB1],np.float32)
WHITE = np.array([0xFF,0xFF,0xFF],np.float32)
LINE  = np.array([0x7E,0x86,0x80],np.float32)
# paredes: cor castanho-escura + abertura morfológica para tirar móveis escuros
# cor da parede = tom escuro mais frequente da imagem
flat = a.reshape(-1,3); dk = flat[flat.mean(1) < 110]
q = (dk//6).astype(np.int32); key = q[:,0]*10000+q[:,1]*100+q[:,2]
u,c = np.unique(key, return_counts=True); top = u[c.argmax()]
wc = np.array([top//10000, (top//100)%100, top%100])*6+3
d = np.sqrt(((a-wc)**2).sum(-1))
wall = (d < 26).astype(np.uint8)*255
k = max(5, int(W/2000*9)) | 1
m = Image.fromarray(wall).filter(ImageFilter.MinFilter(k)).filter(ImageFilter.MaxFilter(k)).filter(ImageFilter.MedianFilter(5))
wall = np.asarray(m) > 127
from scipy import ndimage
lab,nl = ndimage.label(wall); sz = ndimage.sum(wall, lab, range(1,nl+1))
wall = np.isin(lab, np.where(sz >= (W/2000)**2*2500)[0]+1)
# soalho/pavimento = tons quentes de madeira
wood = (warm > 0.16) & (L > 0.35) & (L < 0.85)
wm = Image.fromarray((wood*255).astype(np.uint8)).filter(ImageFilter.MedianFilter(9))
wood = np.asarray(wm) > 127
# grão: luminância local vs média
Lb = np.asarray(Image.fromarray((L*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(W/250))).astype(np.float32)/255
g = np.clip((Lb - L)*4 + 0.15, 0, 1)
floor = FLOOR*(1-g[...,None]) + FLOOR_D*g[...,None]
# resto (móveis, loiças, exterior): quase branco
t = np.clip((L-0.3)/0.6,0,1)
rest = FLOOR*(1-t[...,None]) + WHITE*t[...,None]
out = np.where(wood[...,None], floor, rest)
# contornos
E = np.asarray(Image.fromarray((L*255).astype(np.uint8)).filter(ImageFilter.FIND_EDGES)).astype(np.float32)/255
e = (np.clip((E-0.06)*5,0,1)*0.7)[...,None]
e[wood] *= 0.25
b=6; e[:b]=0; e[-b:]=0; e[:,:b]=0; e[:,-b:]=0
out = out*(1-e) + LINE*e
pool = (a[...,2]-a[...,0] > 35)
out[pool] = out[pool]*0.4 + np.array([0xC9,0xDF,0xD5])*0.6
out[wall] = GREEN
Image.fromarray(out.clip(0,255).astype(np.uint8)).save(dst, quality=90)
