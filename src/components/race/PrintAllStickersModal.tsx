import { Modal, ScrollArea, Button, Group, Container } from '@mantine/core';
import { AidStation } from '@/types';
import { AidStationSticker } from './AidStationSticker';
import { IconPrinter } from '@tabler/icons-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import type { UseReactToPrintOptions } from 'react-to-print';

interface PrintAllStickersModalProps {
  opened: boolean;
  onClose: () => void;
  stations: AidStation[];
}



const PrintContent = ({ stations }: { stations: AidStation[] }) => (
  <div className="print-content" style={{ 
    backgroundColor: 'white',
    width: '210mm',
    margin: '0 auto'
  }}>
    {Array.from({ length: Math.ceil(stations.length / 4) }).map((_, pageIndex) => (
      <div key={pageIndex} className="print-page" style={{
        backgroundColor: 'white',
        width: '210mm',
        height: '297mm',
        pageBreakAfter: 'always',
        padding: '5mm',
        boxSizing: 'border-box'
      }}>
        <div className="print-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '5mm',
          height: '100%'
        }}>
          {stations.slice(pageIndex * 4, (pageIndex + 1) * 4).map((station) => (
            <div key={station.id} className="sticker-container" style={{
              height: '100%',
              backgroundColor: 'white'
            }}>
              <AidStationSticker
                station={station}
                estimatedTimeOfDay="__:__"
              />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export function PrintAllStickersModal({ opened, onClose, stations }: PrintAllStickersModalProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const printOptions: UseReactToPrintOptions = {
    documentTitle: 'Aid Station Stickers',
    onBeforePrint: async () => {
      if (componentRef.current) {
        const content = componentRef.current;
        content.style.display = 'block';
        content.style.visibility = 'visible';
      }
    },
    onAfterPrint: () => {
      console.log('Print completed');
    },
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          background: white !important;
        }
        .print-content {
          width: 210mm !important;
          margin: 0 auto !important;
          background: white !important;
        }
        .print-page {
          width: 210mm !important;
          height: 297mm !important;
          margin: 0 !important;
          padding: 5mm !important;
          page-break-after: always !important;
          background: white !important;
          box-sizing: border-box !important;
        }
        .print-grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          grid-template-rows: repeat(2, 1fr) !important;
          gap: 5mm !important;
          height: 100% !important;
          background: white !important;
        }
        .sticker-container {
          height: 100% !important;
          background: white !important;
          page-break-inside: avoid !important;
        }
        .mantine-Card-root {
          height: 100% !important;
          background: white !important;
        }
      }
    `,
  };

  const handlePrint = useReactToPrint(printOptions);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Print Aid Station Stickers"
      size="90vw"
    >
      <Group justify="flex-end" mb="md">
        <Button variant="light" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={() => {
            if (handlePrint) {
              handlePrint();
            }
          }}
          leftSection={<IconPrinter size={20} />}
          color="blue"
        >
          Print Stickers
        </Button>
      </Group>

      <Container size="xl" p={0} style={{ backgroundColor: 'white' }}>
        <ScrollArea.Autosize mah={800}>
          <div ref={componentRef} style={{ display: 'block', visibility: 'visible' }}>
            <PrintContent stations={stations} />
          </div>
        </ScrollArea.Autosize>
      </Container>
    </Modal>
  );
} 