import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { FaFileDownload } from "react-icons/fa";
import BaseUrl, { GetUrl } from "./BaseUrl";

export const ExportToExcel = ({ apiData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  let products = apiData.map(
    ({
      category,
      subcategory,
      price,
      images,
      number,
      name,
      PK,
      CTN,
      UoM,
      PKVolume,
      CTNVolume,
      PKWeight,
      CTNWeight,
      UPC,
      madeIn,
      length,
      height,
      width,
    }) => ({
      ProductNumber: number,
      images: images.length > 0 ? BaseUrl.concat(images[0]) : "-",
      ProductName: name,
      Price: (price * 1.5).toFixed(2),
      Category: category.length > 0 ? category.join(" | ") : "-",
      SubCategory: subcategory.length > 0 ? subcategory.join(" | ") : "-",
      PK,
      CTN,
      UoM,
      PKVolume,
      CTNVolume,
      PKWeight,
      CTNWeight,
      UPC,
      Dimensions:
        length === undefined
          ? "-"
          : UoM === "Feet"
          ? `${length ?? "-"} ft x ${width ?? "-"} ft x ${height ?? "-"} ft`
          : `${length ?? "-"} inch x ${width ?? "-"} inch x ${
              height ?? "-"
            } inch`,
      Madein: madeIn,
    })
  );

  const exportToCSV = (products, fileName) => {
    const ws = XLSX.utils.json_to_sheet(products);
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "ProductNumber",
          "images",
          "ProductName",
          "Price",
          "Category",
          "SubCategory",
          "PK",
          "CTN",
          "UoM",
          "PkVolume",
          "CTNVolume",
          "PKWeight",
          "CTNWeight",
          "UPC",
          "Dimensions",
          "Madein",
        ],
      ],
      {
        origin: "A1",
      }
    );

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleChangeDownloadCount = async () => {
    await GetUrl("/download-count", {});
  };

  return (
    <button
      onClick={(e) => {
        exportToCSV(products, fileName);
        handleChangeDownloadCount();
      }}
      className=" rounded-md active:scale-95 hover:bg-blue-200 transition"
    >
      Product Catalog
    </button>
  );
};
