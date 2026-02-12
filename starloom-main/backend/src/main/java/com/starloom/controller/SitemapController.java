package com.starloom.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.starloom.entity.Article;
import com.starloom.entity.Category;
import com.starloom.mapper.ArticleMapper;
import com.starloom.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Sitemap 生成控制器 - SEO优化
 */
@RestController
@RequiredArgsConstructor
public class SitemapController {

    private final ArticleMapper articleMapper;
    private final CategoryMapper categoryMapper;
    
    @Value("${app.site-url:https://ibazi.site}")
    private String siteUrl;

    /**
     * 生成 sitemap.xml
     */
    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String generateSitemap() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");
        
        String today = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE);
        
        // 静态页面
        addUrl(xml, "/", today, "daily", "1.0");
        addUrl(xml, "/paipan", today, "weekly", "0.9");
        addUrl(xml, "/hepan", today, "weekly", "0.9");
        addUrl(xml, "/calendar", today, "daily", "0.9");
        addUrl(xml, "/divination", today, "weekly", "0.8");
        addUrl(xml, "/learn", today, "daily", "0.8");
        addUrl(xml, "/master", today, "weekly", "0.8");
        
        // 免费工具页面
        addUrl(xml, "/tool/name-test", today, "weekly", "0.8");
        addUrl(xml, "/tool/baby-name", today, "weekly", "0.8");
        addUrl(xml, "/tool/company-name", today, "weekly", "0.7");
        addUrl(xml, "/tool/dream", today, "weekly", "0.8");
        addUrl(xml, "/tool/zodiac-match", today, "weekly", "0.8");
        addUrl(xml, "/tool/constellation-match", today, "weekly", "0.8");
        addUrl(xml, "/tool/daily-sign", today, "daily", "0.8");
        addUrl(xml, "/tool/fate-test", today, "weekly", "0.7");
        addUrl(xml, "/tool/phone-test", today, "weekly", "0.7");
        addUrl(xml, "/tool/plate-test", today, "weekly", "0.7");
        addUrl(xml, "/tool/past-life", today, "weekly", "0.6");
        addUrl(xml, "/tool/lucky-day", today, "weekly", "0.8");

        // 中文专题落地页（SEO）
        String[] baziTopics = new String[]{
                "bazi-ru-men",
                "shi-shen-jie-du",
                "wu-xing-qiang-ruo",
                "xi-yong-shen",
                "da-yun-liu-nian",
                "hun-yin-he-hun",
                "shi-ye-cai-yun",
                "tao-hua-yuan",
                "fan-tai-sui",
                "ba-zi-chang-jian-wen-da"
        };
        for (String slug : baziTopics) {
            addUrl(xml, "/zhuanti/" + slug, today, "weekly", "0.75");
        }

        String[] dreamTopics = new String[]{
                "she", "diao-ya", "huai-yun", "qian-ren", "kao-shi",
                "shui", "huo", "si-ren", "gui", "zhui",
                "fei", "diao-xia", "xue", "gou", "mao",
                "lao-shu", "yu", "zhu", "hu", "shi-zi",
                "ma", "che", "fang-zi", "ban-jia", "jie-hun",
                "sheng-bing", "yi-yuan", "qian", "diu-dong-xi", "zhao-bu-dao-lu",
                "da-ren", "bei-da", "ku", "xiao", "si-wang",
                "shang-xue", "lao-shi", "tong-shi", "ling-dao", "shou-ji",
                "yao-si", "shu", "hua", "yu-san", "yu",
                "xue-tian", "feng", "shan", "hai"
        };
        for (String slug : dreamTopics) {
            addUrl(xml, "/zhuanti/meng-jian-" + slug, today, "weekly", "0.7");
        }

        String[] namingTopics = new String[]{
                "xing-ming-da-fen",
                "bao-bao-qi-ming",
                "gong-si-qi-ming",
                "ming-zi-zen-me-xuan",
                "wu-xing-yong-zi",
                "san-cai-wu-ge",
                "nan-bao-bao-ming-zi",
                "nv-bao-bao-ming-zi",
                "dian-pu-qu-ming",
                "ming-zi-ji-xiong"
        };
        for (String slug : namingTopics) {
            addUrl(xml, "/zhuanti/" + slug, today, "weekly", "0.7");
        }
        
        // 文章分类页
        List<Category> categories = categoryMapper.selectList(
            new LambdaQueryWrapper<Category>().eq(Category::getStatus, 1)
        );
        for (Category cat : categories) {
            addUrl(xml, "/learn?category=" + cat.getId(), today, "weekly", "0.7");
        }
        
        // 文章详情页
        List<Article> articles = articleMapper.selectList(
            new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, 1)
                .orderByDesc(Article::getPublishTime)
                .last("LIMIT 1000")
        );
        for (Article article : articles) {
            String lastmod = article.getUpdatedAt() != null ? 
                article.getUpdatedAt().format(DateTimeFormatter.ISO_DATE) :
                (article.getPublishTime() != null ? 
                    article.getPublishTime().format(DateTimeFormatter.ISO_DATE) : today);
            addUrl(xml, "/article/" + article.getId(), lastmod, "monthly", "0.6");
        }
        
        xml.append("</urlset>");
        return xml.toString();
    }

    /**
     * 生成英文站 sitemap-en.xml (/en)
     */
    @GetMapping(value = "/sitemap-en.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String generateEnglishSitemap() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        String today = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE);

        // English core pages (static)
        addUrl(xml, "/en", today, "daily", "0.95");
        addUrl(xml, "/en/tarot", today, "weekly", "0.9");
        addUrl(xml, "/en/tarot/cards", today, "weekly", "0.85");
        addUrl(xml, "/en/tarot-reading", today, "weekly", "0.85");
        addUrl(xml, "/en/tarot-yes-no", today, "weekly", "0.8");
        addUrl(xml, "/en/tarot-love-reading", today, "weekly", "0.8");
        addUrl(xml, "/en/tarot-career-reading", today, "weekly", "0.75");
        addUrl(xml, "/en/compatibility", today, "weekly", "0.9");
        addUrl(xml, "/en/zodiac-compatibility", today, "weekly", "0.85");
        addUrl(xml, "/en/astrology", today, "weekly", "0.75");
        addUrl(xml, "/en/horoscope", today, "daily", "0.8");
        addUrl(xml, "/en/numerology", today, "weekly", "0.75");
        addUrl(xml, "/en/life-path-number", today, "weekly", "0.75");
        addUrl(xml, "/en/destiny-number", today, "weekly", "0.7");
        addUrl(xml, "/en/personal-year", today, "weekly", "0.7");
        addUrl(xml, "/en/tools", today, "weekly", "0.8");

        // SEO landing pages (English)
        addUrl(xml, "/en/birth-chart", today, "weekly", "0.75");
        addUrl(xml, "/en/daily-horoscope", today, "weekly", "0.75");
        addUrl(xml, "/en/spiritual-guidance", today, "weekly", "0.7");
        addUrl(xml, "/en/rising-sign", today, "weekly", "0.7");
        addUrl(xml, "/en/moon-sign", today, "weekly", "0.7");
        addUrl(xml, "/en/sun-sign", today, "weekly", "0.65");
        addUrl(xml, "/en/what-is-rising-sign", today, "weekly", "0.65");
        addUrl(xml, "/en/how-to-read-a-birth-chart", today, "weekly", "0.65");
        addUrl(xml, "/en/tarot-spreads-for-beginners", today, "weekly", "0.65");
        addUrl(xml, "/en/how-to-do-a-tarot-reading", today, "weekly", "0.65");
        addUrl(xml, "/en/zodiac-sign-dates", today, "weekly", "0.65");
        addUrl(xml, "/en/mercury-retrograde", today, "weekly", "0.65");
        addUrl(xml, "/en/angel-numbers", today, "weekly", "0.6");

        // Angel numbers
        String[] angelNumbers = new String[] {"111", "222", "333", "444", "555", "666", "777", "888", "8888", "999", "1010", "1111", "1212", "1313", "1414", "2020", "3030"};
        for (String number : angelNumbers) {
            addUrl(xml, "/en/" + number + "-meaning", today, "weekly", "0.6");
        }

        // Numerology long-tail (Life Path meanings)
        for (int n = 1; n <= 9; n++) {
            addUrl(xml, "/en/life-path-" + n + "-meaning", today, "weekly", "0.6");
        }

        // Numerology long-tail (Destiny meanings)
        for (int n = 1; n <= 9; n++) {
            addUrl(xml, "/en/destiny-number-" + n + "-meaning", today, "weekly", "0.6");
        }

        // Numerology long-tail (Personal Year meanings)
        for (int n = 1; n <= 9; n++) {
            addUrl(xml, "/en/personal-year-" + n + "-meaning", today, "weekly", "0.6");
        }

        // Astrology/tarot long-tail
        addUrl(xml, "/en/venus-sign", today, "weekly", "0.6");
        addUrl(xml, "/en/mars-sign", today, "weekly", "0.6");
        addUrl(xml, "/en/saturn-return", today, "weekly", "0.6");
        addUrl(xml, "/en/synastry-compatibility", today, "weekly", "0.6");
        addUrl(xml, "/en/celtic-cross-tarot-spread", today, "weekly", "0.6");
        addUrl(xml, "/en/three-card-tarot-spread", today, "weekly", "0.6");

        // Compatibility matrix (12 x 12)
        String[] signs = new String[]{
                "aries", "taurus", "gemini", "cancer", "leo", "virgo",
                "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
        };
        for (String a : signs) {
            for (String b : signs) {
                addUrl(xml, "/en/" + a + "-and-" + b + "-compatibility", today, "weekly", "0.55");
            }
        }

        // English tools pages
        addUrl(xml, "/en/tools/chakra-quiz", today, "monthly", "0.65");
        addUrl(xml, "/en/tools/crystal-guide", today, "monthly", "0.65");
        addUrl(xml, "/en/tools/affirmation-generator", today, "monthly", "0.6");
        addUrl(xml, "/en/tools/meditation-timer", today, "monthly", "0.6");
        addUrl(xml, "/en/tools/energy-reading", today, "monthly", "0.6");
        addUrl(xml, "/en/tools/moon-phase", today, "monthly", "0.6");
        addUrl(xml, "/en/tools/personal-year", today, "monthly", "0.6");
        addUrl(xml, "/en/tools/rising-sign", today, "monthly", "0.6");

        // NOTE: For large-scale pages (e.g. /en/compatibility/:a/:b and /en/tarot/cards/:slug),
        // we intentionally do not include them here yet to avoid huge sitemaps.

        xml.append("</urlset>");
        return xml.toString();
    }
    
    private void addUrl(StringBuilder xml, String path, String lastmod, String freq, String priority) {
        xml.append("  <url>\n");
        xml.append("    <loc>").append(siteUrl).append(path).append("</loc>\n");
        xml.append("    <lastmod>").append(lastmod).append("</lastmod>\n");
        xml.append("    <changefreq>").append(freq).append("</changefreq>\n");
        xml.append("    <priority>").append(priority).append("</priority>\n");
        xml.append("  </url>\n");
    }

    /**
     * 生成 robots.txt
     */
    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public String generateRobots() {
        return "# robots.txt for ibazi.site\n" +
               "# 天机命理 - 免费八字排盘\n\n" +
               "User-agent: *\n" +
               "Allow: /\n\n" +
               "User-agent: Googlebot\n" +
               "Allow: /\n\n" +
               "User-agent: Baiduspider\n" +
               "Allow: /\n\n" +
               "User-agent: 360Spider\n" +
               "Allow: /\n\n" +
               "User-agent: Sogou web spider\n" +
               "Allow: /\n\n" +
               "User-agent: bingbot\n" +
               "Allow: /\n\n" +
               "Disallow: /api/\n" +
               "Disallow: /admin/\n" +
               "Disallow: /*.json$\n\n" +
               "Sitemap: " + siteUrl + "/sitemap.xml\n" +
               "Sitemap: " + siteUrl + "/sitemap-en.xml\n";
    }
}
