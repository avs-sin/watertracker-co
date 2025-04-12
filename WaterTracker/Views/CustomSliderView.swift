//
//  CustomSliderView.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import SwiftUI

/// Custom slider component
struct CustomSliderView: View {

    let unit: String
    let maxRange: Double
    @Binding var currentValue: Double
    @State private var sliderPosition: Double = 0.0
    @EnvironmentObject var manager: DataManager

    // MARK: - Main rendering function
    var body: some View {
        VStack(alignment: .leading) {
            Text("\(Int(formattedValue)) \(unit)")
                .font(.system(size: 25, weight: .medium))
                .foregroundStyle(.primaryText).opacity(0.7)
            GeometryReader { reader in
                RoundedRectangle(cornerRadius: 10.0).frame(height: 10.0)
                    .foregroundColor(.primaryText).opacity(0.1)
                RoundedRectangle(cornerRadius: 10.0).frame(height: 10.0).opacity(sliderPosition)
                    .foregroundColor(.accentColor).frame(width: sliderPosition + 5)
                Circle().frame(width: 25, height: 25).foregroundColor(.accentColor)
                    .offset(x: sliderPosition).offset(y: -7.5).gesture(
                        DragGesture(minimumDistance: 5.0).onChanged { value in
                            let maxPosition = reader.size.width - 25.0
                            sliderPosition = max(min(value.location.x, maxPosition), 0)
                            if manager.fluidUnits != FluidUnit.oz.rawValue {
                                currentValue = Double((maxRange * sliderPosition) / maxPosition) / AppConfig.ozMl
                            } else {
                                currentValue = (maxRange * sliderPosition) / maxPosition
                            }
                        }
                    )
            }.frame(height: 25.0).overlay(resetSliderPositionObserver)
        }.onAppear {
            if sliderPosition == 0.0 && currentValue > 0 {
                let maxPosition = UIScreen.main.bounds.width - 55.0
                if manager.fluidUnits != FluidUnit.oz.rawValue {
                    sliderPosition = (currentValue * AppConfig.ozMl * maxPosition) / maxRange
                } else {
                    sliderPosition = (currentValue * maxPosition) / maxRange
                }
            }
        }
    }

    /// Reset slider position whenever the value is set to 0
    private var resetSliderPositionObserver: some View {
        DispatchQueue.main.async {
            if currentValue == 0 { sliderPosition = 0.0 }
        }
        return EmptyView()
    }

    /// Formatted current value
    private var formattedValue: Double {
        guard !(currentValue.isNaN || currentValue.isInfinite) else {
            return 0.0
        }
        if manager.fluidUnits != FluidUnit.oz.rawValue {
           return currentValue * AppConfig.ozMl
        }
        return currentValue
    }
}

// MARK: - Preview UI
#Preview {
    struct CustomSliderPreview: View {
        @State var value: Double = 0
        var body: some View {
            CustomSliderView(unit: "oz", maxRange: 16.0, currentValue: $value)
        }
    }
    return CustomSliderPreview().environmentObject(DataManager())
}
