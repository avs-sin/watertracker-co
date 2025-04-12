//
//  CircularProgressView.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import SwiftUI

/// Shows a custom circular progress view
struct CircularProgressView: View {

    let target: Double
    let current: Double
    let unit: String
    let lineWidth: Double
    let fontSize: Int
    @State var widgetView: Bool = false

    // MARK: - Main rendering function
    var body: some View {
        ZStack {
            Circle().strokeBorder(Color.startProgress, lineWidth: lineWidth)
            Circle().foregroundColor(.clear).overlay(
                AngularGradient(
                    gradient: Gradient(colors: [Color.startProgress, Color.accentColor, Color.accentColor, Color.accentColor, Color.accentColor]),
                    center: .center,
                    startAngle: .degrees(-90),
                    endAngle: .degrees(widgetView ? 260 : 270)
                ).mask(Circle())
            ).mask(
                Circle()
                    .trim(from: 0.0, to: progress)
                    .stroke(style: StrokeStyle(lineWidth: lineWidth,
                                               lineCap: .round, lineJoin: .round))
                    .rotationEffect(.degrees(275.0)).padding(lineWidth / 2.0)
            )
            Circle().foregroundColor(.clear).overlay(
                VStack {
                    Circle().frame(width: lineWidth, height: lineWidth)
                    Spacer()
                }
                .foregroundColor(.accentColor)
                .offset(x: widgetView ? -7 : -5)
                .offset(y: widgetView ? 0.5 : 0)
                .opacity(progress > (widgetView ? 0.955 : 0.975) ? 1 :0)
            )
            ProgressLabelsView
        }.animation(.easeInOut(duration: 0.5), value: progress)
    }

    /// Circular progress
    private var progress: Double {
        if formattedCurrentValue == 0 { return 0.0 }
        return Double((Double(formattedCurrentValue) * 100.0) / Double(formattedTargetValue)) / 100.0
    }

    /// Progress labels
    private var ProgressLabelsView: some View {
        Circle().padding(lineWidth).foregroundColor(.white).overlay(
            VStack {
                Text(String(format: "%.0f%%", progress * 100.0))
                    .font(.system(size: Double(fontSize), weight: .bold, design: .rounded))
                    .foregroundColor(.accentColor)
                Text("\(Int(formattedCurrentValue))/\(Int(formattedTargetValue)) \(unit)")
                    .font(.system(size: Double(fontSize) / 3.5))
                    .foregroundColor(.primaryText).opacity(0.5)
            }
        )
    }

    /// Formatted target value
    private var formattedTargetValue: Double {
        if unit != FluidUnit.oz.rawValue {
           return target * AppConfig.ozMl
        }
        return target
    }

    /// Formatted current value
    private var formattedCurrentValue: Double {
        if unit != FluidUnit.oz.rawValue {
           return current * AppConfig.ozMl
        }
        return current
    }
}

// MARK: - Preview UI
#Preview {
    CircularProgressView(target: 2000, current: 1350, unit: "oz", lineWidth: 30, fontSize: 65)
}
