import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function DataTable({ columns, data, emptyMessage = "لا توجد بيانات", onRowClick }) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col.key} className="text-right text-xs font-semibold text-muted-foreground whitespace-nowrap">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow
                  key={row.id || i}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/30" : ""}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}