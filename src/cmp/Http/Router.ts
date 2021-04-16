import {FastifyPluginAsync} from "fastify";
import {GetDesignProducts, DesignProductsOptions} from "@/cmp/Http/routes/design/GetDesignProducts";
import {DesignFiltersOptions, GetDesignFilters} from "@/cmp/Http/routes/design/GetDesignFilters";
import {DesignMontageOptions, PostDesignMontage} from "@/cmp/Http/routes/design/PostDesignMontage";
import {GetProductStatus, ProductStatusOptions} from "@/cmp/Http/routes/design/GetProductStatus";
import {PostFiles, PostFilesOptions} from "@/cmp/Http/routes/design/PostFiles";
import {DesignAlarmOptions, PostDesignAlarm} from "@/cmp/Http/routes/design/PostDesignAlarm";
import {PostDesignChangeStatus, PostDesignChangeStatusOptions} from "@/cmp/Http/routes/design/PostDesignChangeStatus";
import {GetMontages, MontagesOptions} from "@/cmp/Http/routes/montage/GetMontages";
import {GetMontageProductUsage, MontageProductUsageOptions} from "@/cmp/Http/routes/montage/GetMontageProductUsage";
import {GetMontageColors, MontageColorsOptions} from "@/cmp/Http/routes/montage/GetMontageColors";


const pluginCallback: FastifyPluginAsync = async (server, options) => {
    server.get(  '/api/design/products', DesignProductsOptions, GetDesignProducts)
    server.get(  '/api/design/filter', DesignFiltersOptions, GetDesignFilters)
    server.get(  '/api/design/product/:id', ProductStatusOptions, GetProductStatus)
    server.post( '/api/design/montage', DesignMontageOptions, PostDesignMontage)
    server.post( '/api/design/files/:id', PostFilesOptions, PostFiles)
    server.post( '/api/design/alarm', DesignAlarmOptions, PostDesignAlarm)
    server.post( '/api/design/status/:id', PostDesignChangeStatusOptions, PostDesignChangeStatus)

    ///////////// MONTAGE
    server.get(  '/api/montages', MontagesOptions, GetMontages)
    server.get(  '/api/montage/product/:id', MontageProductUsageOptions, GetMontageProductUsage)
    server.get(  '/api/montage/colors/:id', MontageColorsOptions, GetMontageColors)

}


export default pluginCallback
