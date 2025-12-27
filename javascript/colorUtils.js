// Color Utility Functions

/**
 * Generate a random HEX color
 */
function generateRandomHex() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Convert HEX to RGB
 */
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

/**
 * Convert RGB to HEX
 */
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/**
 * Calculate luminance for contrast ratio
 */
function calculateLuminance(r, g, b) {
    const sRGB = [r, g, b].map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1, color2) {
    const lum1 = calculateLuminance(color1.r, color1.g, color1.b);
    const lum2 = calculateLuminance(color2.r, color2.g, color2.b);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine if color is light or dark
 */
function getColorType(r, g, b) {
    const luminance = calculateLuminance(r, g, b);
    return luminance > 0.5 ? 'Light' : 'Dark';
}

/**
 * Generate complementary color
 */
function getComplementaryColor(hex) {
    const rgb = hexToRgb(hex);
    return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

/**
 * Generate analogous colors (3 colors including original)
 */
function getAnalogousColors(hex, count = 3) {
    const hsl = rgbToHsl(...Object.values(hexToRgb(hex)));
    const colors = [];
    const step = 30; // 30 degree step for analogous colors
    
    for (let i = -Math.floor(count/2); i <= Math.floor(count/2); i++) {
        const newHue = (hsl.h + i * step + 360) % 360;
        const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
}

/**
 * Generate triadic colors
 */
function getTriadicColors(hex) {
    const hsl = rgbToHsl(...Object.values(hexToRgb(hex)));
    const colors = [];
    
    for (let i = 0; i < 3; i++) {
        const newHue = (hsl.h + i * 120) % 360;
        const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
}

/**
 * Get color information object
 */
function getColorInfo(hex) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const type = getColorType(rgb.r, rgb.g, rgb.b);
    
    return {
        hex,
        rgb,
        hsl,
        type,
        luminance: calculateLuminance(rgb.r, rgb.g, rgb.b)
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateRandomHex,
        hexToRgb,
        rgbToHex,
        rgbToHsl,
        hslToRgb,
        calculateLuminance,
        calculateContrastRatio,
        getColorType,
        getComplementaryColor,
        getAnalogousColors,
        getTriadicColors,
        getColorInfo
    };
}