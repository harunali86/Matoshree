import React from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Typography } from '../ui/Typography';
import { X } from 'lucide-react-native';

interface SizeGuideModalProps {
    visible: boolean;
    onClose: () => void;
}

const SIZE_CHART = [
    { uk: '6', us: '7', eu: '40', cm: '25' },
    { uk: '7', us: '8', eu: '41', cm: '26' },
    { uk: '8', us: '9', eu: '42', cm: '27' },
    { uk: '9', us: '10', eu: '43', cm: '28' },
    { uk: '10', us: '11', eu: '44', cm: '29' },
    { uk: '11', us: '12', eu: '45', cm: '30' },
    { uk: '12', us: '13', eu: '46', cm: '31' },
];

export const SizeGuideModal = ({ visible, onClose }: SizeGuideModalProps) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl" style={{ maxHeight: '80%' }}>
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
                        <Typography variant="h2" className="text-xl font-bold">Size Guide</Typography>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-6">
                        {/* How to Measure */}
                        <View className="mb-6">
                            <Typography variant="h3" className="mb-3 font-bold">How to Measure Your Foot</Typography>
                            <Typography variant="body" color="muted" className="mb-2">
                                1. Stand on a piece of paper with your heel against a wall
                            </Typography>
                            <Typography variant="body" color="muted" className="mb-2">
                                2. Mark the longest part of your foot
                            </Typography>
                            <Typography variant="body" color="muted" className="mb-2">
                                3. Measure the distance from the wall to the mark
                            </Typography>
                            <Typography variant="body" color="muted">
                                4. Find your size in the chart below
                            </Typography>
                        </View>

                        {/* Size Chart Table */}
                        <View className="mb-6">
                            <Typography variant="h3" className="mb-3 font-bold">Size Chart</Typography>

                            {/* Table Header */}
                            <View className="flex-row bg-gray-100 p-3 rounded-t-lg">
                                <View className="flex-1"><Typography variant="caption" className="font-bold text-center">UK</Typography></View>
                                <View className="flex-1"><Typography variant="caption" className="font-bold text-center">US</Typography></View>
                                <View className="flex-1"><Typography variant="caption" className="font-bold text-center">EU</Typography></View>
                                <View className="flex-1"><Typography variant="caption" className="font-bold text-center">CM</Typography></View>
                            </View>

                            {/* Table Rows */}
                            {SIZE_CHART.map((size, index) => (
                                <View
                                    key={size.uk}
                                    className={`flex-row p-3 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                >
                                    <View className="flex-1"><Typography variant="body" className="text-center">{size.uk}</Typography></View>
                                    <View className="flex-1"><Typography variant="body" className="text-center">{size.us}</Typography></View>
                                    <View className="flex-1"><Typography variant="body" className="text-center">{size.eu}</Typography></View>
                                    <View className="flex-1"><Typography variant="body" className="text-center">{size.cm}</Typography></View>
                                </View>
                            ))}
                        </View>

                        {/* Tips */}
                        <View className="bg-blue-50 p-4 rounded-lg">
                            <Typography variant="body" className="font-bold mb-2">💡 Sizing Tips</Typography>
                            <Typography variant="caption" color="muted">
                                • If you're between sizes, we recommend sizing up{'\n'}
                                • Measure your feet in the evening when they're slightly larger{'\n'}
                                • Leave about 0.5cm of space at the toe for comfort
                            </Typography>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
